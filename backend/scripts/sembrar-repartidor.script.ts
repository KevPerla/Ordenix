import { UserRole } from '../src/modules/auth/domain/enums/user-role.enum';
import { ejecutarSiembra } from './sembrar-usuario';

ejecutarSiembra({
  prefijo: 'REPARTIDOR',
  rol: UserRole.REPARTIDOR,
  etiqueta: 'Repartidor inicial',
});
