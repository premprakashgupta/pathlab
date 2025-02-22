import { BadRequestException, ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrganisationsService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrganisation(
    organisationName: string,
    shortName: string,
    address: string,
    image: string,
    phone: number,
    email: string
  ) {
    try {
      // Check for organisation with the same name
      const sameNameExist = await this.prisma.organisation.findFirst({
        where: { name: organisationName },
      });
      if (sameNameExist) {
        throw new BadRequestException(`Organisation with the same name already exists`);
      }

      // Check for organisation with the same short name
      const sameShortNameExist = await this.prisma.organisation.findFirst({
        where: { shortName },
      });
      if (sameShortNameExist) {
        throw new BadRequestException(`Organisation with the same short name already exists`);
      }

      const isLoginDetailExist=this.prisma.loginDetails.findUnique({
        where: {email },});

      if (isLoginDetailExist!==null) {
        throw new BadRequestException(`User with this email exist`); 
      }

      // create new user credential with auto generate password
      const findRole=await this.prisma.role.findFirst({where:{name:'ROLE_ORGANISATION'}});
      if(findRole===null){
        throw new BadRequestException(`Role with this name not exist`); 
      }
      const password = Math.random().toString(36).slice(-8);
      const login = await this.prisma.loginDetails.create({ data: { email, password,roleId:findRole.id } }); 

      // Create the organisation
      const organisation = await this.prisma.organisation.create({
        data: {
          name: organisationName,
          shortName,
          address,
          image,
          phone,
          loginId:login.id,
        },
      });


      return organisation;
    } catch (error) {
      if (error instanceof ConflictException || error instanceof BadRequestException) {
        throw error;
      }
      console.error(error);
      throw new InternalServerErrorException('Something went wrong while registering the organisation');
    }
  }
}
