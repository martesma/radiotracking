# Be sure to restart your server when you modify this file.

# Your secret key for verifying cookie session data integrity.
# If you change this key, all old sessions will become invalid!
# Make sure the secret is at least 30 characters and all random, 
# no regular words or you'll be exposed to dictionary attacks.
ActionController::Base.session = {
  :key         => '_radiotracking_session',
  :secret      => 'ec7751f45191417f8ac9432d06b6325cbb477086dcc319d91d423b8be12058c172b4f7e9b15191dbad287a316cb2c0b882a54f499da83b7c17daaaa87659cd8e'
}

# Use the database for sessions instead of the cookie-based default,
# which shouldn't be used to store highly confidential information
# (create the session table with "rake db:sessions:create")
# ActionController::Base.session_store = :active_record_store
