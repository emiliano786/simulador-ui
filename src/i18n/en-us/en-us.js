export default {
  general: {
    version: 'Version'
  },
  inputs: {
    name: 'Name',
    email: 'Email',
    password: 'Password'
  },
  btns: {
    add: 'Add',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    search: 'Search',
    clear: 'Clear'
  },
  login: {
    socratesPhrase: 'Socrates',
    welcome: 'Welcome!',
    welcomeDescription: 'Please log in to continue.',
    email: 'Email',
    password: 'Password',
    login: 'Login',
    loginCred: 'Login',
    logout: 'Logout',
    goBack: 'Go Back',
    error: {
      title: 'Authentication Error',
      message: 'The provided credentials are incorrect.',
      details: 'Please verify the following:',
      close: 'Close',
      verifyUsername: 'Verify that the username is correct',
      verifyPassword: 'Verify that the password is correct',
      checkCapsLock: 'Make sure caps lock is disabled'
    }
  },
  header: {
    title: 'Simulator'
  },
  footer: {
    copyright: '© 2023-{year}'
  },
  sidebar: {
    user: 'User',
    userRole: 'System User',
    deploysMonitoring: 'Process Monitoring',
    users: 'Users',
    profiles: 'Profiles',
    logout: 'Logout',
    logoutConfirmTitle: 'Logout?',
    logoutConfirmMessage:
      'Are you sure you want to logout? This action will redirect you to the login page.',
    logoutCancel: 'Cancel',
    logoutConfirm: 'Logout',
    logoutNote: 'All unsaved changes will be lost.'
  },
  deploysMonitoring: {
    title: 'Deployments Monitoring',
    description: 'Monitor and manage your application deployments.',
    newDeployment: 'New deployment',
    viewDetails: 'View details and configuration',
    replicas: 'Replicas',
    port: 'Port',
    tlsActive: 'TLS Active',
    tlsInactive: 'TLS Inactive',
    tlsDisabledMessage: 'TLS is not configured for this deployment',
    tlsEnabledMessage: 'TLS is configured for this deployment',
    expiresOn: 'Expires on',
    globalSearch: 'Global search',
    status: {
      pending: 'Pending',
      running: 'Running',
      succeeded: 'Succeeded',
      failed: 'Failed',
      unknown: 'Unknown',
      'true': 'Succeeded',
      'false': 'Running'
      
    },
    filters: {
      criteriaTitle: 'Filter Criteria',
      search: 'Search by name',
      status: 'Status',
      minPort: 'Min port',
      maxPort: 'Max port',
      applyFilters: 'Apply filters',
      clearFilters: 'Clear filters',
      pendingStatus: 'Pending',
      runningStatus: 'Running',
      succeededStatus: 'Succeeded',
      failedStatus: 'Failed',
      unknownStatus: 'Unknown'
    },
    restartAll:{
      title: 'Reiniciar todos los procesos existentes.'
    },
    restartDeploy: 'Restart deployment',
    actions: {
      edit: 'Edit',
      delete: 'Delete'
    },
    restart: {
      confirmation: {
        title: 'Confirm Deployment Restart',
        message: 'You are about to restart the deployment',
        messageEnd: '. This action will temporarily interrupt the service.',
        deployInfo: 'Deployment Information',
        status: 'Status',
        warnings: {
          title: 'Important Warnings',
          serviceInterruption: 'Service will be temporarily unavailable',
          connectionLoss: 'Active connections will be lost',
          recoveryTime: 'Service recovery may take a few minutes'
        },
        cancel: 'Cancel',
        confirm: 'Confirm Restart'
      }
    },
    layout: {
      title: 'Data Elements Layout',
      description: 'Configure the data elements layout for this deployment',
      currentLayout: 'Current Layout',
      configureLayout: 'Configure Layout',
      layoutOptions: 'Layout Options',
      dataElements: 'Data Elements',
      configureLayout: 'Configure layout',
      layoutUpdated: 'Layout updated successfully',
      selectLayout: 'Select a layout',
      layoutDescription: 'Layout Description',
      elementsIncluded: 'Elements included in this layout'
    }
  },
  deployForm: {
    title: 'Deployment Details',
    general: {
      title: 'General',
      description:
        'Configure the basic deployment parameters, including name, port, environment to be deployed, and number of replicas.',
      name: 'Deployment name',
      portServer: 'Listening port',
      port: 'Port',
      portClient: 'Connection port',
      deployTarget: 'Deployment',
      replicas: 'Replicas'
    },
    logging: {
      title: 'Logging',
      description:
        'Define the logging level for the deployment. A higher level provides more debugging information.',
      level: 'Logging level',
      options: {
        debug: 'Debug',
        info: 'Info',
        severe: 'Severe'
      }
    },
    security: {
      title: 'Security',
      description:
        'Configure TLS security and certificates required for the deployment. Certificates must be in PEM format.',
      tlsActive: 'TLS Active',
      tlsInactive: 'TLS Inactive',
      secureConnections: 'Secure connections enabled',
      insecureConnections: 'Insecure connections',
      benefitsTitle: 'Benefits activated',
      benefits: {
        encryption: 'Data encryption in transit',
        authentication: 'Server authentication',
        integrity: 'Data integrity'
      },
      considerationsTitle: 'Security considerations',
      considerations: {
        unencrypted: 'Data is transmitted unencrypted',
        noVerification: 'Server identity is not verified',
        developmentOnly: 'Recommended only for development environments'
      },
      keyFile: 'Certificate .key',
      certFile: 'Certificate .cert',
      expiresOn: 'Expires',
      expiresSoon: 'The certificate expires soon. Consider renewing it.',
      expired: 'The certificate has expired. You must renew it immediately.',
      moreInfo: 'More info',
      timeUnits: {
        days: 'days',
        day: 'day',
        months: 'months',
        month: 'month',
        years: 'years',
        year: 'year',
        expiresIn: 'Expires in',
        expiredAgo: 'Expired',
        expiresToday: 'Expires today'
      }
    },
    actions: {
      saveChanges: 'Save changes',
      updateDeploy: 'Update deployment',
      createDeploy: 'Create deployment',
      cancel: 'Cancel',
      continue: 'Continue',
      finish: 'Finish',
      close: 'Close'
    },
    delete: {
      title: 'Delete Deployment',
      deployToDelete: 'Deployment to Delete',
      status: 'Status',
      tls: 'TLS',
      layout: 'Layout',
      dataElements: 'data elements',
      tlsActive: 'TLS Active',
      tlsInactive: 'TLS Inactive',
      warningMessage:
        'You are about to permanently delete this deployment, its containers and all its data. This action cannot be undone.',
      alternativeMessage: 'If you are not sure, you can resolve or cancel this action instead.',
      confirmationLabel: 'Type',
      confirmationText: 'delete',
      confirmationSuffix: 'to continue with the deployment deletion',
      confirmationInputLabel: 'Confirm deletion',
      deleteButton: 'Delete'
    },
    confirmation: {
      title: 'Update deployment',
      createTitle: 'Create deployment',
      infoTitle: 'Update confirmation',
      createInfoTitle: 'Creation confirmation',
      infoMessage: 'You are about to update the deployment',
      createInfoMessage: 'You are about to create a new deployment',
      infoMessageEnd: 'with the new configured parameters.',
      createInfoMessageEnd: 'with the configured parameters.',
      processTitle: 'Update process',
      createProcessTitle: 'Creation process',
      steps: {
        validation: {
          title: 'Configuration validation',
          description: 'All parameters and certificates will be verified before proceeding.'
        },
        application: {
          title: 'Applying changes',
          description: 'Deployment parameters and TLS configuration will be updated.'
        },
        createApplication: {
          title: 'Creating deployment',
          description:
            'The deployment will be created with the specified parameters and TLS configuration.'
        },
        restart: {
          title: 'Controlled restart',
          description: 'The deployment will restart to apply the new changes.'
        },
        verification: {
          title: 'Status verification',
          description: 'It will be confirmed that the deployment works correctly.'
        }
      }
    },
    success: {
      title: 'Update Successful!',
      createTitle: 'Creation Successful!',
      message: 'The deployment',
      createMessage: 'The deployment',
      messageEnd: 'has been successfully updated with all new parameters and certificates.',
      createMessageEnd: 'has been successfully created with all parameters and certificates.',
      changesApplied: 'Changes applied',
      createChangesApplied: 'Deployment created',
      changes: {
        general: 'General configuration updated',
        logging: 'Logging level configured',
        tls: 'TLS certificates applied'
      },
      createChanges: {
        general: 'General configuration applied',
        logging: 'Logging level configured',
        tls: 'TLS certificates applied'
      },
      redirectNote: 'You will be redirected to the deployments view to see the reflected changes.'
    },
    error: {
      title: 'Operation Error!',
      createTitle: 'Creation Error!',
      updateTitle: 'Update Error!',
      message: 'An error occurred while processing the request.',
      createMessage: 'An error occurred while creating the deployment.',
      updateMessage: 'An error occurred while updating the deployment.',
      errorDetail: 'Error details:',
      redirectNote: 'You will be redirected to the deployments view.',
      actions: {
        close: 'Close'
      }
    }
  },
  layoutConfig: {
    title: 'Message list',
    currentDeploy: 'Current Deployment',
    noDeploySelected: 'No deployment selected',
    currentLayout: 'Current Layout',
    selectLayout: 'Select Layout',
    selectLayoutDescription:
      'Choose the data elements layout that best suits your deployment needs. Each layout includes different combinations of ISO 8583 data elements.',
    dataElementsIncluded: 'Data Elements Included',
    useCase: 'Use Case',
    cancel: 'Cancel',
    applyChanges: 'Apply Changes',
    confirmation: {
      title: 'Confirm Layout Change',
      message: 'You are about to change the data elements layout for deployment',
      messageEnd: '. This will update the layout configuration.',
      layoutChange: 'Layout Change',
      from: 'From',
      cancel: 'Cancel',
      apply: 'Apply Changes'
    }
  },
  users: {
    title: 'User Management',
    description: 'Manage system users and their access permissions.',
    newUser: 'New user',
    updateUser: 'Update user',
    deleteUser: 'Delete user',
    createUser: 'Create user',
    deleteInfoMessage: 'You are about to delete the user',
    deleteMessage: 'There was an error deleting the user',
    redirectNote: 'You will be redirected to the users view to see the reflected changes.',
    successDelete: 'The user has been successfully deleted from the system.',
    form: {
      title: 'user Details',
      general: {
        titleUpdateuser: 'Update user',
        descriptionUpdateuser: 'Modify the user user with updated permissions and configurations.',
        titleCreateuser: 'Create user',
        decriptionCreateuser:
          'Define a new user user with specific permissions and configurations.',
        title: 'General Information',
        description:
          'Configure the basic user information including personal data and credentials.',
        name: 'Name',
        lastname: 'Last Name',
        username: 'Username',
        password: 'Password',
        userType: 'User Type',
        profile: 'Profile',
        userName: 'Name',
        userDescription: 'Description',
        status: 'Status',
        actions: 'Actions',
        active: 'Active',
        inactive: 'Inactive',
        user: 'user',
        email: 'Email',
        userToDelete: 'user to Delete',
        deleteUser: 'User to delete'
      },
      actions: {
        saveChanges: 'Save changes',
        createuser: 'Create user',
        updateuser: 'Update user',
        deleteuser: 'Delete user',
        cancel: 'Cancel',
        continue: 'Continue'
      },
      confirmation: {
        title: 'Update user',
        createTitle: 'Create user',
        deleteTitle: 'Delete user',
        infoTitle: 'Update confirmation',
        createInfoTitle: 'Creation confirmation',
        deleteInfoTitle: 'Deletion confirmation',
        infoMessage: 'You are about to update the user',
        createInfoMessage: 'You are about to create a new user',
        deleteInfoMessage: 'You are about to delete the user',
        infoMessageEnd: 'with the new configured parameters.',
        createInfoMessageEnd: 'with the configured parameters.',
        deleteInfoMessageEnd: 'This action cannot be undone.',
        processTitle: 'Update process',
        createProcessTitle: 'Creation process',
        deleteProcessTitle: 'Deletion process',
        steps: {
          validation: {
            title: 'Information validation',
            description: 'All user data will be verified before proceeding.'
          },
          application: {
            title: 'Applying changes',
            description: 'user information will be updated in the system.'
          },
          createApplication: {
            title: 'Creating user',
            description: 'The user will be created with the specified information.'
          },
          deleteApplication: {
            title: 'Deleting user',
            description: 'The user will be permanently removed from the system.'
          },
          verification: {
            title: 'Verification',
            description: 'It will be confirmed that the user was processed correctly.'
          }
        }
      },
      success: {
        title: 'Update Successful!',
        createTitle: 'Creation Successful!',
        deleteTitle: 'Deletion Successful!',
        message: 'The user',
        createMessage: 'The user',
        deleteMessage: 'The user',
        messageEnd: 'has been successfully updated with all new parameters.',
        createMessageEnd: 'has been successfully created with all parameters.',
        deleteMessageEnd: 'has been successfully deleted from the system.',
        changesApplied: 'Changes applied',
        createChangesApplied: 'user created',
        deleteChangesApplied: 'user deleted',
        changes: {
          general: 'General information updated',
          credentials: 'Credentials updated'
        },
        createChanges: {
          general: 'General information applied',
          credentials: 'Credentials configured'
        },
        redirectNote: 'You will be redirected to the users view to see the reflected changes.'
      },
      failed: {
        deleteTitle: 'Error Deleting',
        deleteMessage: 'There was an error deleting the user'
      }
    }
  },
  profiles: {
    title: 'My Profiles',
    description: 'Manage profile profiles and custom configurations.',
    newProfile: 'New profile',
    viewDetails: 'View details and configuration',
    deleteProfile: 'Delete profile',
    editProfile: 'Edit profile',
    form: {
      title: 'Profile Details',
      general: {
        titleUpdateProfile: 'Update Profile',
        descriptionUpdateProfile:
          'Modify the profile profile with updated permissions and configurations.',
        titleCreateProfile: 'Create Profile',
        decriptionCreateProfile:
          'Define a new profile profile with specific permissions and configurations.',
        title: 'General Information',
        description:
          'Configure the basic profile information including personal data and credentials.',
        name: 'Name',
        lastname: 'Last Name',
        profilename: 'profilename',
        password: 'Password',
        profileType: 'profile Type',
        profileName: 'Name',
        profileDescription: 'Description',
        status: 'Status',
        actions: 'Actions',
        active: 'Active',
        inactive: 'Inactive',
        profile: 'Profile',
        email: 'Email',
        profileToDelete: 'Profile to Delete',
        deleteprofile: 'Profile to delete'
      },
      actions: {
        saveChanges: 'Save changes',
        createProfile: 'Create profile',
        updateProfile: 'Update profile',
        deleteProfile: 'Delete profile',
        cancel: 'Cancel',
        continue: 'Continue'
      },
      confirmation: {
        title: 'Update profile',
        createTitle: 'Create profile',
        deleteTitle: 'Delete profile',
        infoTitle: 'Update confirmation',
        createInfoTitle: 'Creation confirmation',
        deleteInfoTitle: 'Deletion confirmation',
        infoMessage: 'You are about to update the profile',
        createInfoMessage: 'You are about to create a new profile',
        deleteInfoMessage: 'You are about to delete the profile',
        infoMessageEnd: 'with the new configured parameters.',
        createInfoMessageEnd: 'with the configured parameters.',
        deleteInfoMessageEnd: 'This action cannot be undone.',
        processTitle: 'Update process',
        createProcessTitle: 'Creation process',
        deleteProcessTitle: 'Deletion process',
        steps: {
          validation: {
            title: 'Information validation',
            description: 'All profile data will be verified before proceeding.'
          },
          application: {
            title: 'Applying changes',
            description: 'Profile information will be updated in the system.'
          },
          createApplication: {
            title: 'Creating profile',
            description: 'The profile will be created with the specified information.'
          },
          deleteApplication: {
            title: 'Deleting profile',
            description: 'The profile will be permanently removed from the system.'
          },
          verification: {
            title: 'Verification',
            description: 'It will be confirmed that the profile was processed correctly.'
          }
        }
      },
      success: {
        title: 'Update Successful!',
        createTitle: 'Creation Successful!',
        deleteTitle: 'Deletion Successful!',
        message: 'The profile',
        createMessage: 'The profile',
        deleteMessage: 'The profile',
        messageEnd: 'has been successfully updated with all new parameters.',
        createMessageEnd: 'has been successfully created with all parameters.',
        deleteMessageEnd: 'has been successfully deleted from the system.',
        changesApplied: 'Changes applied',
        createChangesApplied: 'Profile created',
        deleteChangesApplied: 'Profile deleted',
        changes: {
          general: 'General information updated',
          credentials: 'Credentials updated'
        },
        createChanges: {
          general: 'General information applied',
          credentials: 'Credentials configured'
        },
        redirectNote: 'You will be redirected to the profiles view to see the reflected changes.'
      },
      failed: {
        deleteTitle: 'Error Deleting',
        deleteMessage: 'There was an error deleting the profile'
      }
    }
  },
  profileCreation: {
    form: {
      permissions: {
        title: 'Permissions',
        options: 'Options',
        actions: 'Actions',
        hideAll: 'Hide all',
        showAll: 'Show all'
      }
    }
  },
  modules: {
    manage: 'Deployments Manager',
    user: 'Users',
    profiles: 'Profiles'
  },
  actions: {
    list: 'List',
    add: 'Add',
    edit: 'Edit',
    delete: 'Delete',
    restart: 'Restart'
  },
  deploys: {
    successDelete: 'The process has been deleted sucessfully',
    redirectNote: 'You will be redirected to the monitoring view',
    errorDetail: 'There was a problem when trying to delete process '
  }
};
