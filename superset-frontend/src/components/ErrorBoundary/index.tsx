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
import { Component, ErrorInfo, ReactNode } from 'react';
import { t } from '@superset-ui/core';
import ErrorAlert from 'src/components/ErrorMessage/ErrorAlert';

export interface ErrorBoundaryProps {
  children: ReactNode;
  onError?: (error: Error, info: ErrorInfo) => void;
  showMessage?: boolean;
  style?: React.CSSProperties;
}

interface ErrorBoundaryState {
  error: Error | null;
  info: ErrorInfo | null;
}

export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  static defaultProps: Partial<ErrorBoundaryProps> = {
    showMessage: true,
  };

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: null, info: null };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    this.props.onError?.(error, info);
    this.setState({ error, info });
  }

  render() {
    const { error, info } = this.state;
    if (error) {
      const firstLine = error.toString().split('\n')[0];
      if (this.props.showMessage) {
        return (
          <ErrorAlert
            errorType={t('Unexpected error')}
            message={firstLine}
            descriptionDetails={info?.componentStack}
            style={this.props.style}
          />
        );
      }
      return null;
    }
    return this.props.children;
  }
}
