/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import { Link } from 'react-router-dom';
import { isFeatureEnabled, FeatureFlag, t } from '@superset-ui/core';
import { CardStyles } from 'src/views/CRUD/utils';
import { Dropdown } from 'src/components/Dropdown';
import { Menu } from 'src/components/Menu';
import ConfirmStatusChange from 'src/components/ConfirmStatusChange';
import ListViewCard from 'src/components/ListViewCard';
import Icons from 'src/components/Icons';
import { Tag } from 'src/views/CRUD/types';
import { deleteTags } from 'src/features/tags/tags';
import { Button } from 'src/components';

interface TagCardProps {
  tag: Tag;
  hasPerm: (name: string) => boolean;
  _bulkSelectEnabled: boolean; // Renamed to match function parameter
  refreshData: () => void;
  loading: boolean;
  addDangerToast: (msg: string) => void;
  addSuccessToast: (msg: string) => void;
  _tagFilter?: string; // Renamed to match function parameter
  _userId?: string | number; // Renamed to match function parameter
  showThumbnails?: boolean;
}

function TagCard({
  tag,
  hasPerm,
  refreshData,
  addDangerToast,
  addSuccessToast,
  showThumbnails,
}: TagCardProps) {
  const canDelete = hasPerm('can_write');

  const handleTagDelete = (tag: Tag) => {
    deleteTags([tag], addSuccessToast, addDangerToast);
    refreshData();
  };

  const menu = (
    <Menu>
      {canDelete && (
        <Menu.Item>
          <ConfirmStatusChange
            title={t('Please confirm')}
            description={
              <>
                {t('Are you sure you want to delete')} <b>{tag.name}</b>?
              </>
            }
            onConfirm={() => handleTagDelete(tag)}
          >
            {confirmDelete => (
              <div
                role="button"
                tabIndex={0}
                className="action-button"
                onClick={confirmDelete}
                data-test="dashboard-card-option-delete-button"
              >
                <Icons.DeleteOutlined iconSize="l" /> {t('Delete')}
              </div>
            )}
          </ConfirmStatusChange>
        </Menu.Item>
      )}
    </Menu>
  );
  return (
    <CardStyles>
      <ListViewCard
        title={tag.name}
        cover={
          !isFeatureEnabled(FeatureFlag.Thumbnails) || !showThumbnails ? (
            <></>
          ) : null
        }
        url={undefined}
        linkComponent={Link}
        imgFallbackURL="/static/assets/images/dashboard-card-fallback.svg"
        description={t('Modified %s', tag.changed_on_delta_humanized)}
        actions={
          <ListViewCard.Actions
            onClick={e => {
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            <Dropdown dropdownRender={() => menu} trigger={['click', 'hover']}>
              <Button buttonSize="xsmall" type="link">
                <Icons.MoreOutlined iconSize="xl" />
              </Button>
            </Dropdown>
          </ListViewCard.Actions>
        }
      />
    </CardStyles>
  );
}

export default TagCard;
