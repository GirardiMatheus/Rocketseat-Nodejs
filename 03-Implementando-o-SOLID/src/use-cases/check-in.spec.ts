import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'


let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Check-in Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    gymsRepository.itens.push({
      id: 'gym-01',
      title: 'JS Gym',
      description: '',
      phone: '',
      latitude: new Decimal(0),
      Longitude: new Decimal(0),
    })
    
    const { checkIn } = await sut.execute({
      gymId: 'gym-01', 
      userId: 'user-01',
      userLatitude: -22.7227793,
      userLongitude: -42.6597059,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2024, 0, 28, 8, 0, 0))
    
    await sut.execute({
      gymId: 'gym-01', 
      userId: 'user-01',
      userLatitude: -22.7227793,
      userLongitude: -42.6597059,
    })

    await expect(() => 
      sut.execute({
        gymId: 'gym-01', 
        userId: 'user-01',
        userLatitude: -22.7227793,
        userLongitude: -42.6597059,
      })
    ).rejects.toBeInstanceOf(Error)
  })

  it('should be able to check in twice in different days', async () => {
    vi.setSystemTime(new Date(2024, 0, 28, 8, 0, 0))
    
    await sut.execute({
      gymId: 'gym-01', 
      userId: 'user-01',
      userLatitude: -22.7227793,
      userLongitude: -42.6597059,
    })

    vi.setSystemTime(new Date(2024, 0, 29, 8, 0, 0))
const {checkIn} = await sut.execute({
        gymId: 'gym-01', 
        userId: 'user-01',
        userLatitude: -22.7227793,
        userLongitude: -42.6597059,
      })
    
      expect(checkIn.id).toEqual(expect.any(String))
    })

    it('should not be able to check in on distant gym', async () => {
      gymsRepository.itens.push({
        id: 'gym-02',
        title: 'JS Gym',
        description: '',
        phone: '',
        latitude: new Decimal(0),
        Longitude: new Decimal(0),
      })
      
      await expect(() => sut.execute({
        gymId: 'gym-01', 
        userId: 'user-01',
        userLatitude: -22.7195687,
        userLongitude: -41.9156873,
      })).rejects.toBeInstanceOf(Error)
    })
})





