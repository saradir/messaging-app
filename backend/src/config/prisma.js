import  {PrismaClient} from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = `${process.env.DATABASE_URL}`

const adapter = new PrismaPg({ connectionString, ssl: false })
const prisma = new PrismaClient({ adapter })


export default prisma;