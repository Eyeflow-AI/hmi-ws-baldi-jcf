function getUserRole(accessControlData, role) {

  let accessControl = {};
  (accessControlData?.roles?.[role]?.types ?? []).forEach((value) => {
    accessControl[value] = true;
  });
  return accessControl;

};

export default getUserRole;