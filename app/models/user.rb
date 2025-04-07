class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
  
  validates :role, inclusion: { in: %w(user admin) }

  # Helper methods for role checking
  def admin?
    role == "admin"
  end

  has_many :locations
end
