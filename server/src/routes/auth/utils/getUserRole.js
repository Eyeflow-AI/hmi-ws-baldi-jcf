function getUserRole(accessControlData, accessControl) {

  // console.log({ accessControlData, accessControl })
  let rolesEntries = Object.entries(accessControlData?.roles ?? {});
  let authorization = [];
  Object.entries(accessControl).forEach(([key, value]) => {
    if (value) {
      authorization.push(key);
    }
  });

  for (let [role, roleData] of rolesEntries) {
    if (role !== 'view' && authorization.every(el => roleData.types.includes(el)) && roleData.types.every(el => authorization.includes(el))) {
      // console.log({ role, roleData })
      return role;
    };
  };

  if (Object.entries(accessControl).every(([key, value]) => !value)) {
    return 'view';
  }
  else {
    return 'customRole';
  }
};

export default getUserRole;