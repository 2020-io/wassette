# Network Access Control Test Script
# Used by all network-test-* agents to validate ACL enforcement

import asyncio

async def test_network_access():
    # Get agent metadata
    agent_name = globals().get('agent_name', 'Unknown Agent')

    print(f"{agent_name} executing")
    print()

    # Test URLs
    test_urls = [
        'https://www.google.com',
        'https://www.yahoo.com'
    ]

    for url in test_urls:
        print(f"Testing access to {url}")

        try:
            result = await restricted_api.fetch(url)

            # Check if result indicates permission denial or error
            if isinstance(result, str) and '[Permission denied' in result:
                print(f"Access: Failure")
                print(f"Reason for failure: Permission denied")
            elif isinstance(result, str) and '[Fetch error' in result:
                print(f"Access: Failure")
                print(f"Reason for failure: Network error")
            else:
                print(f"Access: Success")

        except Exception as e:
            print(f"Access: Failure")
            print(f"Reason for failure: {type(e).__name__}: {str(e)}")

        print()

# Run the test
asyncio.ensure_future(test_network_access())
