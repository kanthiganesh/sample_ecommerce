import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@prisma/client";
const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  connectionLimit: 5,
});
const prismaClient = new PrismaClient({ adapter })
.$extends({
  result:{
    address:{
      formattedAdress :{
        needs:{
          lineOne:true,
          lineTwo:true,
          city:true,
          country:true,
          pincode:true
        },
        compute: (addr)=>{
          return `${addr.lineOne},${addr.lineTwo},${addr.city},${addr.country}-${addr.pincode}`
        }
      }
    }
  }
});
export { prismaClient };