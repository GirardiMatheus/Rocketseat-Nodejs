import type { Gym } from "@prisma/client";
import type { GymsRepository } from "../gyms-repository";

export class InMemoryGymsRepository implements GymsRepository{
  public itens: Gym[] = []

  async findById(id: string) {
    const gym = this.itens.find(item => item.id == id)
    
    if (!gym) {
      return null
    }

    return gym
  }
}