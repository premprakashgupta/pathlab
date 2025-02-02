import { BadRequestException, ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Organisation, Role } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrganisationsService {
    constructor(readonly prisma:PrismaService) {}

    async createOrganisation(organisationName:string,shortName:string,address:string,image:string,phone:number,loginId:number){
        
        try {
            const sameNameExist=await this.prisma.$queryRaw`SELECT * FROM organisation WHERE name=${organisationName} LIMIT 1;`;
            if(sameNameExist){
                throw new BadRequestException(`Organisation with same name is exist`)
            }
            const sameShortNameExist=await this.prisma.$queryRaw`SELECT * FROM organisation WHERE shortName=${shortName} LIMIT 1;`;
            if(sameShortNameExist){
                throw new BadRequestException(`Organisation with same short name is exist`)
            }
            // creating organisation 
            await this.prisma.$executeRaw`INSERT INTO organisation (name,shortName,address,image,phone,loginId) VALUES (${organisationName},${shortName},${address},${image},${phone},${loginId});`;
            const [organisation]=await this.prisma.$queryRaw<Organisation[]>`SELECT * FROM organisation WHERE name=${organisationName} AND shortName=${shortName};`;
            // creating organisation role

            const roles =await this.prisma.$queryRaw<Role[]>`SELECT * FROM role WHERE status=true;`;

            if(roles.length===0){
                throw new BadRequestException(`There is no any role in the system`);
            }

           Promise.all(roles.map(async(role)=>{
                await this.prisma.$executeRaw`INSERT INTO organisationRole (organisationId,roleId) VALUES (${organisation.id},${role.id});`
           })) 
            
           

            return organisation;
        } catch (error) {
            if (error instanceof ConflictException || error instanceof BadRequestException) {
                    throw error;
                  }
                  console.error(error);
                  throw new InternalServerErrorException('Something went wrong while registering the user');
        }
        
        // return this.prisma.organization.create({
        //     data:{
        //         name:organisationName,
        //         shortName:shortName,
        //         address:address,
        //         image:image,
        //         phone:phone,
        //         loginDetail:{connect:{id:loginId}}

        //     }
        // })
    }
}
