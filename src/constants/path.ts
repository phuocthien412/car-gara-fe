const PATH = {
  HOME: '/car-gara-fe/',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  LOGIN: '/login',
  USER: '/user',
  USER_DETAIL: '/user/:userId',
  USER_UPDATE: '/user/:userId/edit',
  USER_PROFILE: '/user/profile',
  LIEN_HE: '/car-gara-fe/lien-he',
  DICH_VU: '/car-gara-fe/dich-vu',
  DICH_VU_DETAIL: '/car-gara-fe/dich-vu/:dichVuId',
  DU_AN: '/car-gara-fe/du-an',
  DU_AN_DETAIL: '/car-gara-fe/du-an/:duAnId',
  TIN_TUC: '/car-gara-fe/tin-tuc',
  TIN_TUC_DETAIL: '/car-gara-fe/tin-tuc/:tinTucId',
 
} as const

export default PATH
