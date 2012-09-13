class UsersController < ApplicationController
  def login
    if current_user
      redirect_to '/released_animal'
    else
      if request.post?
	user = User.authenticate(params['username'], params['password'])
	if user.nil?
	  flash.now[:notice] = "That was incorrect, honeybunch."
	  render 'login'
	else
	  sign_in(user)
	  redirect_to '/released_animal'
	end
      else
	render 'login'
      end
    end
  end

  def logout
    sign_out
    redirect_to '/users/login'
  end
end
