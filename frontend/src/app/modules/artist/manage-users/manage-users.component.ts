import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ArtistInsertRequest} from '../../../endpoints/artist-endpoints/artist-insert-or-update-endpoint.service';
import {
  UserSearchEndpointService, UserSearchRequest,
  UserSearchResponse
} from '../../../endpoints/user-endpoints/user-search-endpoint.service';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {
  UserArtistGetAllResponse,
  UserArtistsGetAllEndpointService
} from '../../../endpoints/user-artist-endpoints/user-artists-get-all-endpoint.service';
import {
  RolesGetAllEndpointService,
  UserArtistRole
} from '../../../endpoints/user-artist-endpoints/roles-get-all-endpoint.service';
import {MatSelectChange} from '@angular/material/select';
import {
  UserArtistAddOrUpdateRoleEndpointService
} from '../../../endpoints/user-artist-endpoints/user-artist-add-or-update-role-endpoint.service';
import {
  UserArtistRemoveEndpointService
} from '../../../endpoints/user-artist-endpoints/user-artist-remove-endpoint.service';
import {MyUserAuthService} from '../../../services/auth-services/my-user-auth.service';
import {Router} from '@angular/router';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['../artist-create-or-edit/artist-create-or-edit.component.css', './manage-users.component.css']
})
export class ManageUsersComponent implements OnInit {
  findUsers: UserSearchResponse[] | null = null;
  searchRequest : UserSearchRequest = {
    searchString: ""
  };
  selectedUsers : UserSearchResponse[] | null = [];


  currentUsers: UserArtistGetAllResponse[] | null = null;
  roles: UserArtistRole[] | null = null;
  rolesChanged : boolean = false;

  @Input() artist: ArtistInsertRequest = {
    bio: "",
    name:""
  };
  @Output() cancelEvent = new EventEmitter<null>();
  errorMessage: string = "";

  ngOnInit(): void {
    if(!this.auth.isLoggedIn())
    {
      this.router.navigate(['/auth/login']);
    }

      this.userSearchService.handleAsync(this.searchRequest).subscribe({
        next: data => {
          this.findUsers = data;
        },
        error: (err:HttpErrorResponse) => {
          alert(err.message);
        }
      })

      this.getCurrentUsers.handleAsync(this.artist.id!).subscribe({
        next: data => {
          this.currentUsers = data;
        },
        error: (err:HttpErrorResponse) => {
          alert(err.message);
        }
      })

    this.getRoles.handleAsync().subscribe(data => {
      this.roles = data;
    })
  }

  constructor(private httpClient: HttpClient,
              private auth: MyUserAuthService,
              private router: Router,
              private userSearchService: UserSearchEndpointService,
              private getCurrentUsers: UserArtistsGetAllEndpointService,
              private getRoles: RolesGetAllEndpointService,
              private updateRoleService: UserArtistAddOrUpdateRoleEndpointService,
              private removeUserService: UserArtistRemoveEndpointService) {
  }

  emitCancel() {
    this.cancelEvent.emit();
  }

  changeRole(id: number, e: MatSelectChange) {
    let user= this.currentUsers?.find(cu => cu.id === id)!
    user.role = this.roles?.find(r => r.roleName === e.value)!;
    user.rolesChanged = true;
  }

  updateRole(user: UserArtistGetAllResponse) {
    this.updateRoleService.handleAsync({
      roleId: user.role.id,
      addUserId: user.id,
      artistId: this.artist.id!
    }).subscribe({
      next: data => {
        user.rolesChanged = false;
        alert(JSON.stringify(data));
      },
      error: (err: HttpErrorResponse) => alert(err.message)
    })
  }

  removeUser(cu: UserArtistGetAllResponse) {
    if(confirm("Are you sure you want to remove " + cu.username + "?"))
    {
      this.removeUserService.handleAsync({
        artistId: this.artist.id!,
        userId: cu.id
      }).subscribe({
        next: data => {
          alert(JSON.stringify(data));
          this.ngOnInit();
        },
        error: (err: HttpErrorResponse) => {
          alert(err.message);
        }
      })
    }
  }

  addUser(e: MatAutocompleteSelectedEvent) {
    if(!this.selectedUsers?.includes(e.option.value)
      && this.currentUsers?.find(cu => cu.id === (e.option.value as UserSearchResponse).id) == undefined)
    {
      this.selectedUsers!.push(e.option.value);
      this.errorMessage = "";
    }
    else
    {
      this.errorMessage = "This user is already in the invite list or is already part of the profile!"
    }
  }

  updateUsers(e: Event) {
    this.searchRequest.searchString = (e.target as HTMLInputElement).value;
    this.userSearchService.handleAsync(this.searchRequest).subscribe({
      next: data => {
        this.findUsers = data;
      }
    })
  }

  sendInvite(cu: UserSearchResponse) {
    console.log(JSON.stringify({
      artistId: this.artist.id!,
      addUserId: cu.id,
      roleId: cu.roleId!
    }));
    this.updateRoleService.handleAsync({
      artistId: this.artist.id!,
      addUserId: cu.id,
      roleId: cu.roleId!
    }).subscribe({
      next: data => {
        this.removeFromInviteList(cu);
        this.ngOnInit();
        alert("Successfully invited " + cu.username + "!")
      },
      error: (err: HttpErrorResponse) => {
        alert(err.error)
      }
    })
  }

  displayUsername(u: UserSearchResponse) :string {
    return u && u.username ? u.username : "";
  }

  setRole(u: UserSearchResponse, e: MatSelectChange) {
    u.roleId = e.value;
  }

  removeFromInviteList(cu: UserSearchResponse) {
    cu.roleId = undefined;
    this.selectedUsers = this.selectedUsers!.filter(u => u.id != cu.id);
  }
}
