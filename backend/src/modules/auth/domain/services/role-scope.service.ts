import { UserRole } from '../enums/user-role.enum';

export interface RoleScope {
  rol: UserRole;
  area: string;
  lema: string;
  permisos: string[];
}

const ROLE_SCOPES: Readonly<Record<UserRole, RoleScope>> = {
  [UserRole.CLIENTE]: {
    rol: UserRole.CLIENTE,
    area: 'Cliente',
    lema: 'Pides, sigues y recibes.',
    permisos: [
      'Hacer pedidos desde el catálogo',
      'Guardar tus direcciones de entrega',
      'Seguir cada pedido hasta tu puerta',
    ],
  },
  [UserRole.REPARTIDOR]: {
    rol: UserRole.REPARTIDOR,
    area: 'Reparto',
    lema: 'Llevas los pedidos y cierras tu turno.',
    permisos: [
      'Recibir las entregas asignadas a tu zona',
      'Marcar cada pedido como entregado',
      'Liquidar el efectivo al cerrar el turno',
    ],
  },
  [UserRole.ADMINISTRADOR]: {
    rol: UserRole.ADMINISTRADOR,
    area: 'Administración',
    lema: 'Tienes el control de toda la operación.',
    permisos: [
      'Administrar el catálogo y los precios',
      'Asignar pedidos y repartidores',
      'Verificar las liquidaciones de efectivo',
    ],
  },
};

export function getRoleScope(rol: UserRole): RoleScope {
  return ROLE_SCOPES[rol];
}
