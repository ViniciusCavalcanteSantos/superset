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

// NOTE: Targeted import (as opposed to `import *`) is important here for proper tree-shaking
// eslint-disable-next-line no-restricted-imports
import {
  AlignCenterOutlined,
  AlignLeftOutlined,
  AlignRightOutlined,
  ApartmentOutlined,
  AppstoreOutlined,
  AreaChartOutlined,
  ArrowRightOutlined,
  BarChartOutlined,
  BgColorsOutlined,
  BellOutlined,
  BookOutlined,
  CaretUpOutlined,
  CaretDownOutlined,
  CaretLeftOutlined,
  CaretRightOutlined,
  CalendarOutlined,
  CheckOutlined,
  CheckCircleOutlined,
  CheckCircleFilled,
  CheckSquareOutlined,
  CloseOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  ColumnWidthOutlined,
  CommentOutlined,
  ConsoleSqlOutlined,
  CopyOutlined,
  DashboardOutlined,
  DatabaseOutlined,
  DeleteFilled,
  DownSquareOutlined,
  DeleteOutlined,
  DownOutlined,
  DownloadOutlined,
  EditOutlined,
  EllipsisOutlined,
  ExclamationCircleOutlined,
  ExclamationCircleFilled,
  EyeOutlined,
  EyeInvisibleOutlined,
  FallOutlined,
  FieldTimeOutlined,
  FileImageOutlined,
  FileOutlined,
  FileTextOutlined,
  FireOutlined,
  FullscreenExitOutlined,
  FullscreenOutlined,
  FundProjectionScreenOutlined,
  FunctionOutlined,
  InfoCircleOutlined,
  InfoCircleFilled,
  InsertRowAboveOutlined,
  InsertRowBelowOutlined,
  LineChartOutlined,
  LinkOutlined,
  MailOutlined,
  MinusCircleOutlined,
  LoadingOutlined,
  MonitorOutlined,
  MoreOutlined,
  PieChartOutlined,
  PicCenterOutlined,
  PlusCircleOutlined,
  PlusOutlined,
  ReloadOutlined,
  RightOutlined,
  SaveOutlined,
  SearchOutlined,
  SettingOutlined,
  StarOutlined,
  StarFilled,
  StopOutlined,
  SyncOutlined,
  TagOutlined,
  TagsOutlined,
  TableOutlined,
  LockOutlined,
  UnlockOutlined,
  UploadOutlined,
  UpOutlined,
  UserOutlined,
  VerticalAlignBottomOutlined,
  VerticalAlignTopOutlined,
  VerticalLeftOutlined,
  VerticalRightOutlined,
  NumberOutlined,
  ThunderboltOutlined,
  FilterOutlined,
  UnorderedListOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { IconType } from './types';
import { BaseIconComponent } from './BaseIcon';

const AntdIcons = {
  AlignCenterOutlined,
  AlignLeftOutlined,
  AlignRightOutlined,
  ApartmentOutlined,
  AppstoreOutlined,
  AreaChartOutlined,
  ArrowRightOutlined,
  BarChartOutlined,
  BgColorsOutlined,
  BellOutlined,
  BookOutlined,
  CaretUpOutlined,
  CaretDownOutlined,
  CaretLeftOutlined,
  CaretRightOutlined,
  CalendarOutlined,
  CheckOutlined,
  CheckCircleOutlined,
  CheckCircleFilled,
  CheckSquareOutlined,
  CloseOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  ColumnWidthOutlined,
  CommentOutlined,
  ConsoleSqlOutlined,
  CopyOutlined,
  DashboardOutlined,
  DatabaseOutlined,
  DeleteFilled,
  DownSquareOutlined,
  DeleteOutlined,
  DownOutlined,
  DownloadOutlined,
  EditOutlined,
  EllipsisOutlined,
  ExclamationCircleOutlined,
  ExclamationCircleFilled,
  EyeOutlined,
  EyeInvisibleOutlined,
  FallOutlined,
  FieldTimeOutlined,
  FileImageOutlined,
  FileOutlined,
  FileTextOutlined,
  FireOutlined,
  FullscreenExitOutlined,
  FullscreenOutlined,
  FundProjectionScreenOutlined,
  FunctionOutlined,
  InfoCircleOutlined,
  InfoCircleFilled,
  InsertRowAboveOutlined,
  InsertRowBelowOutlined,
  LineChartOutlined,
  LinkOutlined,
  LoadingOutlined,
  MailOutlined,
  MinusCircleOutlined,
  MonitorOutlined,
  MoreOutlined,
  PieChartOutlined,
  PicCenterOutlined,
  PlusCircleOutlined,
  PlusOutlined,
  ReloadOutlined,
  RightOutlined,
  SaveOutlined,
  SearchOutlined,
  SettingOutlined,
  StarOutlined,
  StarFilled,
  StopOutlined,
  SyncOutlined,
  TagOutlined,
  TagsOutlined,
  TableOutlined,
  LockOutlined,
  UploadOutlined,
  UnlockOutlined,
  UpOutlined,
  UserOutlined,
  VerticalAlignBottomOutlined,
  VerticalAlignTopOutlined,
  VerticalLeftOutlined,
  VerticalRightOutlined,
  NumberOutlined,
  ThunderboltOutlined,
  FilterOutlined,
  UnorderedListOutlined,
  WarningOutlined,
};

const AntdEnhancedIcons = Object.keys(AntdIcons)
  .filter(k => !k.includes('TwoTone'))
  .map(k => ({
    [k]: (props: IconType) => (
      <BaseIconComponent
        component={AntdIcons[k as keyof typeof AntdIcons]}
        fileName={k}
        {...props}
      />
    ),
  }))
  .reduce((l, r) => ({ ...l, ...r }));

export default AntdEnhancedIcons;
