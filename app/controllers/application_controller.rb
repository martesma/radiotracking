# Filters added to this controller apply to all controllers in the application.
# Likewise, all the methods added will be available for all controllers.

class ApplicationController < ActionController::Base
  helper :all # include all helpers, all the time
  protect_from_forgery # See ActionController::RequestForgeryProtection for details

  before_filter :authorize

  def sign_in(user)
    user.remember_me!
    cookies[:remember_token] = { :value => user.remember_token,
      :expires => 20.years.from_now.utc }
    self.current_user = user
  end

  def current_user=(user)
    @current_user = user
  end

  def user_from_remember_token
    remember_token = cookies[:remember_token]
    User.find_by_remember_token(remember_token) unless remember_token.nil?
  end

  def current_user
    @current_user ||= user_from_remember_token
  end

  def signed_in?
    !current_user.nil?
  end

  def sign_out
    cookies.delete(:remember_token)
    self.current_user = nil
  end

  private

  def authorize
    unless signed_in?
      if request.path !~ %r{login}
	redirect_to '/users/login'
      end
    else
      @current_user = current_user
    end
  end

  # Scrub sensitive parameters from your log
  # filter_parameter_logging :password
end
