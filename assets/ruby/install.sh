gem install ruby_wasm
# Download a prebuilt Ruby release
curl -LO https://github.com/ruby/ruby.wasm/releases/latest/download/ruby-3.4-wasm32-unknown-wasip1-full.tar.gz
tar xfz ruby-3.4-wasm32-unknown-wasip1-full.tar.gz

# Extract ruby binary not to pack itself
mv ruby-3.4-wasm32-unknown-wasip1-full/usr/local/bin/ruby ruby.wasm

# Put your app code
mkdir src
echo "puts 'Hello'" > src/my_app.rb

# Pack the whole directory under /usr and your app dir
rbwasm pack ruby.wasm --dir ./src::/src --dir ./ruby-3.4-wasm32-unknown-wasip1-full/usr::/usr -o my-ruby-app.wasm

# Run the packed scripts
wasmtime my-ruby-app.wasm src/my_app.rb
