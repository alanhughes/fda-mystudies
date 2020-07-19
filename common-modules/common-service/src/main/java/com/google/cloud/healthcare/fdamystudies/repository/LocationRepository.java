/*
 * Copyright 2020 Google LLC
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */

package com.google.cloud.healthcare.fdamystudies.repository;

import java.util.List;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.google.cloud.healthcare.fdamystudies.model.LocationEntity;

@Repository
@ConditionalOnProperty(
    value = "participant.manager.repository.enabled",
    havingValue = "true",
    matchIfMissing = false)
public interface LocationRepository extends JpaRepository<LocationEntity, String> {

  @Query("SELECT location from LocationEntity location where location.id=:locationId")
  public List<LocationEntity> getListOfLocationId(String locationId);

  @Query(
      value =
          "SELECT * FROM locations WHERE status = 1 AND id NOT IN (SELECT DISTINCT location_id FROM sites WHERE study_id = :studyId)",
      nativeQuery = true)
  public List<LocationEntity> getLocationsForSite(String studyId);
}
