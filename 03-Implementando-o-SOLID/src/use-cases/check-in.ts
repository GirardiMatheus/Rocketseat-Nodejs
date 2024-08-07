import type { CheckInsRepository } from "@/repositories/check-ins-repository";
import type { GymsRepository } from "@/repositories/gyms-repository";
import type { CheckIn } from "@prisma/client";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface CheckInUseCaseRequest {
  userId: string
  gymId: string
  userLatitude: number
  userLongitude: number
}

interface CheckInUseCaseResponse {
  checkIn: CheckIn
}

export class CheckInUseCase {
  constructor( 
    private checkInsRepository : CheckInsRepository,
    private gymsRepository: GymsRepository,
    ){}

  async execute({
    userId, 
    gymId,
    userLatitude,
    userLongitude,
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    const gym = await this.gymsRepository.findById(gymId)

    if (!gym) {
      throw new ResourceNotFoundError()
    }



    const checkOnSameDate = await this.checkInsRepository.findByUserIdOnDate(
      userId,
      new Date(),
    )

    if (checkOnSameDate) {
      throw new Error()
    }
    
    const checkIn = await this.checkInsRepository.create({
      gym_id: gymId,
      user_id: userId
    })

    return {
      checkIn,
    }
  }
}