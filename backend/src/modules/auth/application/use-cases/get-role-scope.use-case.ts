import type { UserRole } from '../../domain/enums/user-role.enum';
import {
  getRoleScope,
  type RoleScope,
} from '../../domain/services/role-scope.service';

export interface GetRoleScopeInput {
  rol: UserRole;
}

export class GetRoleScopeUseCase {
  execute(input: GetRoleScopeInput): RoleScope {
    return getRoleScope(input.rol);
  }
}
