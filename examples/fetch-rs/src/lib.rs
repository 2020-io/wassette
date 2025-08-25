// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

use spin_sdk::http::{send, Request, Response};

#[allow(warnings)]
mod bindings;

use bindings::Guest;
use serde_json::Value;

struct Component;

impl Guest for Component {
    fn fetch(url: String) -> Result<String, String> {
        spin_executor::run(async move {
            let request = Request::get(url);
            let response: Response = send(request).await.map_err(|e| e.to_string())?;
            let status = response.status();
            if !(200..300).contains(status) {
                return Err(format!("Request failed with status code: {}", status));
            }
            let body = String::from_utf8_lossy(response.body());

            if let Some(content_type) = response.header("content-type").and_then(|v| v.as_str()) {
                if content_type.contains("application/json") {
                    let json: Value = serde_json::from_str(&body).map_err(|e| e.to_string())?;
                    return Ok(json_to_markdown(&json));
                } else if content_type.contains("text/html") {
                    return Ok(html_to_markdown(&body));
                }
            }

            Ok(body.into_owned())
        })
    }

    fn web_search(
        query: String,
        max_results: u32,
        language: Option<String>,
        region: Option<String>,
    ) -> Result<String, String> {
        spin_executor::run(async move {
            // Use Brave Search API
            let mut search_url = format!(
                "https://api.search.brave.com/res/v1/web/search?q={}&count={}",
                urlencoding::encode(&query),
                max_results.min(20) // Brave API limits to 20 results per request
            );

            // Add language parameter if provided
            if let Some(lang) = language {
                search_url.push_str(&format!("&search_lang={}", urlencoding::encode(&lang)));
            }

            // Add region parameter if provided
            if let Some(ref reg) = region {
                search_url.push_str(&format!("&country={}", urlencoding::encode(reg)));
            }

            let request = Request::get(search_url);
            
            // Note: Brave Search API typically requires an API key via X-Subscription-Token header
            // For this example component, we'll attempt the request and handle auth errors gracefully
            // In a production environment, you would add: 
            // request = request.header("X-Subscription-Token", "your-api-key");

            let response: Response = send(request).await.map_err(|e| e.to_string())?;
            let status = response.status();
            
            if *status == 401 {
                return Ok(format!(
                    "# Web Search Results for: \"{}\"\n\n\
                    **Error**: Brave Search API requires authentication.\n\n\
                    To use this search functionality, you need to:\n\
                    1. Get an API key from https://brave.com/search/api/\n\
                    2. Configure the component with your API key\n\n\
                    **Alternative**: Consider using a different search provider that doesn't require authentication.",
                    query
                ));
            }
            
            if !(200..300).contains(status) {
                return Err(format!(
                    "Search request failed with status code: {}",
                    status
                ));
            }

            let body = String::from_utf8_lossy(response.body());

            // Parse the JSON response from Brave Search API
            let search_results = parse_brave_response(&body, max_results, &query, region);

            Ok(search_results)
        })
    }
}

fn parse_brave_response(
    json_str: &str,
    max_results: u32,
    query: &str,
    region: Option<String>,
) -> String {
    let mut results = String::new();
    results.push_str(&format!("# Web Search Results for: \"{}\"\n\n", query));
    results.push_str(&format!("**Limited to {} results**\n\n", max_results));

    if let Some(ref reg) = region {
        results.push_str(&format!("**Region:** {}\n\n", reg));
    }

    // Parse JSON response from Brave Search API
    match serde_json::from_str::<Value>(json_str) {
        Ok(json) => {
            let mut count = 0u32;

            // Check for web results
            if let Some(web) = json.get("web") {
                if let Some(web_results) = web.get("results") {
                    if let Some(results_array) = web_results.as_array() {
                        results.push_str("## Search Results\n\n");
                        
                        for (i, result) in results_array.iter().enumerate() {
                            if count >= max_results {
                                break;
                            }
                            
                            let title = result.get("title")
                                .and_then(|t| t.as_str())
                                .unwrap_or("No title");
                            
                            let url = result.get("url")
                                .and_then(|u| u.as_str())
                                .unwrap_or("#");
                            
                            let description = result.get("description")
                                .and_then(|d| d.as_str())
                                .unwrap_or("No description available");
                            
                            results.push_str(&format!("{}. **[{}]({})**\n\n", i + 1, title, url));
                            results.push_str(&format!("   {}\n\n", description));
                            
                            count += 1;
                        }
                        
                        if count > 0 {
                            results.push_str("---\n\n");
                        }
                    }
                }
            }

            // Check for answer/knowledge graph
            if let Some(infobox) = json.get("infobox") {
                if let Some(title) = infobox.get("title") {
                    if let Some(title_str) = title.as_str() {
                        results.push_str("## Knowledge Graph\n\n");
                        results.push_str(&format!("**{}**\n\n", title_str));
                        
                        if let Some(description) = infobox.get("description") {
                            if let Some(desc_str) = description.as_str() {
                                results.push_str(&format!("{}\n\n", desc_str));
                            }
                        }
                        
                        if let Some(url) = infobox.get("url") {
                            if let Some(url_str) = url.as_str() {
                                results.push_str(&format!("**Source:** {}\n\n", url_str));
                            }
                        }
                        
                        results.push_str("---\n\n");
                    }
                }
            }

            // Check for related queries
            if let Some(query_obj) = json.get("query") {
                if let Some(altered) = query_obj.get("altered") {
                    if let Some(altered_str) = altered.as_str() {
                        if altered_str != query {
                            results.push_str("## Did you mean?\n\n");
                            results.push_str(&format!("**{}**\n\n", altered_str));
                            results.push_str("---\n\n");
                        }
                    }
                }
            }

            if count == 0 {
                results.push_str("No search results found for this query.\n\n");
                results.push_str("**Suggestions:**\n");
                results.push_str("- Try rephrasing your search query\n");
                results.push_str("- Use more specific or different keywords\n");
                results.push_str("- Check if your search terms are spelled correctly\n\n");
                
                // Show any error from the API
                if let Some(error) = json.get("error") {
                    results.push_str(&format!("**API Error:** {}\n\n", error));
                }
            }
        }
        Err(e) => {
            results.push_str(&format!("Error parsing search results: {}\n\n", e));
            results.push_str("**Raw response preview:**\n");
            let preview = if json_str.len() > 300 {
                &json_str[..300]
            } else {
                json_str
            };
            results.push_str(&format!("```\n{}\n```\n", preview));
        }
    }

    results
}

fn html_to_markdown(html: &str) -> String {
    let mut markdown = String::new();
    let fragment = scraper::Html::parse_fragment(html);
    let text_selector = scraper::Selector::parse("h1, h2, h3, h4, h5, h6, p, a, div").unwrap();

    for element in fragment.select(&text_selector) {
        let tag_name = element.value().name();
        let text = element
            .text()
            .collect::<Vec<_>>()
            .join(" ")
            .trim()
            .to_string();

        if text.is_empty() {
            continue;
        }

        match tag_name {
            "h1" => markdown.push_str(&format!("# {}\n\n", text)),
            "h2" => markdown.push_str(&format!("## {}\n\n", text)),
            "h3" => markdown.push_str(&format!("### {}\n\n", text)),
            "h4" => markdown.push_str(&format!("#### {}\n\n", text)),
            "h5" => markdown.push_str(&format!("##### {}\n\n", text)),
            "h6" => markdown.push_str(&format!("###### {}\n\n", text)),
            "p" => markdown.push_str(&format!("{}\n\n", text)),
            "a" => {
                if let Some(href) = element.value().attr("href") {
                    markdown.push_str(&format!("[{}]({})\n\n", text, href));
                } else {
                    markdown.push_str(&format!("{}\n\n", text));
                }
            }
            _ => markdown.push_str(&format!("{}\n\n", text)),
        }
    }

    markdown.trim().to_string()
}

fn json_to_markdown(value: &Value) -> String {
    match value {
        Value::Object(map) => {
            let mut markdown = String::new();
            for (key, val) in map {
                markdown.push_str(&format!("### {}\n\n{}\n\n", key, json_to_markdown(val)));
            }
            markdown
        }
        Value::Array(arr) => {
            let mut markdown = String::new();
            for (i, val) in arr.iter().enumerate() {
                markdown.push_str(&format!("1. {}\n", json_to_markdown(val)));
                if i < arr.len() - 1 {
                    markdown.push('\n');
                }
            }
            markdown
        }
        Value::String(s) => s.clone(),
        Value::Number(n) => n.to_string(),
        Value::Bool(b) => b.to_string(),
        Value::Null => "null".to_string(),
    }
}
bindings::export!(Component with_types_in bindings);
