import db from '../src/config/db'
import { connectDB } from '../src/server'

jest.mock('../src/config/db')

describe('connectDB', () => {
  test('should handle database connection error', async () => {
    jest
      .spyOn(db, 'authenticate')
      .mockRejectedValueOnce(new Error('Hubo un error al conectar a la BD'))
    const consoleSpy = jest.spyOn(console, 'log')

    await connectDB()
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Hubo un error al conectar a la BD')
    )
  })
})
