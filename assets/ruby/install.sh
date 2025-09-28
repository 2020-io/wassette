#!/usr/bin/env ruby

gem install ruby_wasm

# Download a prebuilt Ruby release
curl -LO https://github.com/ruby/ruby.wasm/releases/latest/download/ruby-3.4-wasm32-unknown-wasip1-full.tar.gz
tar xfz ruby-3.4-wasm32-unknown-wasip1-full.tar.gz

# Extract ruby binary not to pack itself
mv ruby-3.4-wasm32-unknown-wasip1-full/usr/local/bin/ruby ruby.wasm

# Put your app code
echo "puts 'Hello'" > app.rb

# Pack the whole directory under /usr and your app dir
rbwasm pack ruby.wasm --dir ./src::/src --dir ./ruby-3.4-wasm32-unknown-wasip1-full/usr::/usr -o ruby_wrapper.wasm

# Moved to run.sh
#wasmtime ruby_wrapper.wasm app.rb
