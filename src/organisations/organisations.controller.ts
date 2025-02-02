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

@Controller('organisation')
export class OrganisationsController {
  constructor(private readonly organisationsService: OrganisationsService) {}

  @UseGuards(AuthGuard)
  @Post("create")
    register(@Request() req: AuthenticatedRequest,@Body() organisationDto: OrganisationDto) {
      const {name,shortName,image,phone,address}=trimValues(organisationDto);
      return this.organisationsService.createOrganisation(name.trim(),shortName.trim(),address,image,phone,req.user.sub);
    }
}
