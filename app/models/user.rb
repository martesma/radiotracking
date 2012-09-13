require 'digest'

class User < ActiveRecord::Base
  attr_accessor :password
  attr_accessible :username, :password, :password_confirmation

#  validates :password, :presence     => true,
#    :confirmation => true,
#    :length       => { :within => 6..40 }

  before_save :encrypt_password

  def has_password?(submitted_password)
    encrypted_password == encrypt(submitted_password)
  end

  def self.authenticate(un, pw)
    user = User.find_by_username(un)
    return nil if user.nil?
    return user if user.has_password?(pw)
  end

  def remember_me!
    self.remember_token = encrypt("#{salt}--#{id}--#{Time.now.utc}")
    save_without_validation
  end

  private

  def encrypt_password
    unless password.nil?
      self.salt = make_salt unless has_password?(password)
      self.encrypted_password = encrypt(password)
    end
  end

  def encrypt(string)
    secure_hash("#{salt}--#{string}")
  end

  def make_salt
    secure_hash("#{Time.now.utc}--#{password}")
  end

  def secure_hash(string)
    Digest::SHA2.hexdigest(string)
  end
end
