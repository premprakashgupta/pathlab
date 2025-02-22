import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { OrganisationsService } from './organisations.service';
import { OrganisationDto } from './dto/organisation';
import { Request as ExpressRequest } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { trimValues } from 'src/utils/globalExtensions';

interface AuthenticatedRequest extends ExpressRequest {
  user: {
    email: string;
    sub: number;
  };
}

interface NewOrganisation extends OrganisationDto {
  email: string;
}

@Controller('organisation')
export class OrganisationsController {
  constructor(private readonly organisationsService: OrganisationsService) {}

  @UseGuards(AuthGuard)
  @Post("create")
    register(@Request() req: AuthenticatedRequest,@Body() organisationDto: NewOrganisation) {
      const {name,shortName,image,phone,address,email}=trimValues(organisationDto);

      return this.organisationsService.createOrganisation(name.trim(),shortName.trim(),address,image,phone,email);
    }
}
