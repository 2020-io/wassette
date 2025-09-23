#!/usr/bin/env bash

if [ "$1" == "local" ]
then
	echo "* Building mcpd from source"
	git clone https://github.com:mozilla-ai/mcpd
	pushd mcpd > /dev/null

	echo "-> make build" > /dev/stderr
	make build
	err=$?
	echo -e "<- make build returned $err\n" > /dev/stderr
	if [ $err -ne 0 ]; then exit $err; fi
	
	echo "* Installing mcpd from source"
	echo "-> sudo make install" > /dev/stderr
	sudo make install # Install mcpd 'globally' to /usr/local/bin
	err=$?
	echo -e "<- make install returned $err\n" > /dev/stderr
	if [ $err -ne 0 ]; then exit $err; fi
	
	which mcpd
	mcpd --version
	echo.
	
	popd > /dev/null

	echo "* Calling exit $err"
	exit $err
fi

function install_mcpd() {
    command -v curl >/dev/null || { echo "curl not found"; return 1; }
    command -v jq >/dev/null || { echo "jq not found"; return 1; }

    latest_version=$(curl -s https://api.github.com/repos/mozilla-ai/mcpd/releases/latest | jq -r .tag_name)
    os=$(uname)
    arch=$(uname -m)

    zip_name="mcpd_${os}_${arch}.tar.gz"
    url="https://github.com/mozilla-ai/mcpd/releases/download/${latest_version}/${zip_name}"

    echo "Downloading: $url"
    curl -sSL "$url" -o "$zip_name" || { echo "Download failed"; return 1; }

    echo "Extracting: $zip_name"
    tar -xzf "$zip_name" mcpd || { echo "Extraction failed"; return 1; }

    echo "Installing to /usr/local/bin"
    sudo mv mcpd /usr/local/bin/mcpd && sudo chmod +x /usr/local/bin/mcpd || { echo "Install failed"; return 1; }

    rm -f "$zip_name"
    echo "mcpd installed successfully"
}

install_mcpd