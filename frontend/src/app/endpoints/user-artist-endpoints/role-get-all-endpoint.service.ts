import { Injectable } from '@angular/core';

export interface UsereRole {
  id: number;
  roleName: string;
}

@Injectable({
  providedIn: 'root'
})
export class RoleGetAllEndpointService {

  constructor() { }
}
