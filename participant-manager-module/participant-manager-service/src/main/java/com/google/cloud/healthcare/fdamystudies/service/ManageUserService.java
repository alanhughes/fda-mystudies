/*
 * Copyright 2020 Google LLC
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */

package com.google.cloud.healthcare.fdamystudies.service;

import com.google.cloud.healthcare.fdamystudies.beans.AdminUserResponse;
import com.google.cloud.healthcare.fdamystudies.beans.AuditLogEventRequest;
import com.google.cloud.healthcare.fdamystudies.beans.GetAdminDetailsResponse;
import com.google.cloud.healthcare.fdamystudies.beans.GetUsersResponse;
import com.google.cloud.healthcare.fdamystudies.beans.UserRequest;

public interface ManageUserService {

  public AdminUserResponse createUser(UserRequest user, AuditLogEventRequest auditRequest);

  public AdminUserResponse updateUser(
      UserRequest user, String loggedInAdminUserId, AuditLogEventRequest auditRequest);

  public GetAdminDetailsResponse getAdminDetails(String userId, String adminId);

  public GetUsersResponse getUsers(
      String superAdminUserId, Integer page, Integer limit, AuditLogEventRequest auditRequest);

  public AdminUserResponse sendInvitation(String userId, String superAdminUserId);

  public void sendInvitationEmailForNewAdmins();
}
