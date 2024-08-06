import type { UsersRepository } from "@/repositories/users-repository"
import { hash } from "bcryptjs"
import { UserAlreadyExistsError } from "./errors/user-already-exist-error"
import type { User } from "@prisma/client"

interface RegisterUseCaseRquest {
  name: string
  email: string
  password: string
}

interface RegisterUseCaseResponse{
  user: User
}

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ name, email, password,}: RegisterUseCaseRquest): Promise<RegisterUseCaseResponse> {
    const password_hash = await hash(password, 6)
  
    const userWithSameEmail = await this.usersRepository.findByEmail(email)
  
    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }
    
    const user = await this.usersRepository.create({
      name,
      email,
      password_hash,
    })

    return {
      user,
    }
  }
}
