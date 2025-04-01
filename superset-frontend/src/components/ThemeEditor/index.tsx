/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * under the Apache License, Version 2.0 (the
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
import { useState, useEffect } from 'react';
import {
  Modal,
  Tooltip,
  Card,
  Input,
  InputNumber,
  Typography,
  Form,
  Collapse,
  Switch,
  Checkbox,
  ColorPicker,
} from 'antd-v5';
import Button from 'src/components/Button';
import { Icons } from 'src/components/Icons';
import { JsonEditor } from 'src/components/AsyncAceEditor';
import { themeObject, t } from '@superset-ui/core';
import { mergeWith } from 'lodash';

const { Title } = Typography;
const { Panel } = Collapse;

const seedTokenCategories = {
  Colors: [
    { token: 'colorBgBase', type: 'color' },
    { token: 'colorPrimary', type: 'color' },
    { token: 'colorSuccess', type: 'color' },
    { token: 'colorWarning', type: 'color' },
    { token: 'colorError', type: 'color' },
    { token: 'colorInfo', type: 'color' },
    { token: 'colorLink', type: 'color' },
  ],
  Typography: [
    { token: 'fontFamily', type: 'string' },
    { token: 'fontFamilyCode', type: 'string' },
    { token: 'fontSize', type: 'number' },
    { token: 'fontWeightStrong', type: 'number' },
    { token: 'lineHeight', type: 'number' },
  ],
  Layout: [
    { token: 'borderRadius', type: 'number' },
    { token: 'sizeUnit', type: 'number' },
    { token: 'controlHeight', type: 'number' },
    { token: 'zIndexBase', type: 'number' },
    { token: 'zIndexPopupBase', type: 'number' },
  ],
};

export default function ThemeEditor() {
  const [tokens, setTokens] = useState({});
  const [jsonOverrides, setJsonOverrides] = useState('{}');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    if (!isModalOpen) return;

    const initialTheme = themeObject.toSerializedConfig();
    const { algorithm } = initialTheme;

    const filteredKeys = Object.values(seedTokenCategories)
      .flat()
      .map(entry => entry.token);

    const initialTokens = filteredKeys.reduce((acc, key) => {
      acc[key] = themeObject.theme[key];
      return acc;
    }, {});

    setTokens(initialTokens);
    setIsDark(algorithm?.includes('dark'));
    setIsCompact(algorithm?.includes('compact'));
  }, [isModalOpen]);

  const setToken = (key, value) => {
    setTokens(prev => ({ ...prev, [key]: value }));
  };

  const updateColorBgBase = dark => {
    setToken('colorBgBase', dark ? '#141414' : '#ffffff');
  };

  const getMergedTheme = () => {
    let overrides = {};
    try {
      overrides = JSON.parse(jsonOverrides);
    } catch (e) {
      console.log('Invalid JSON in overrides:', e);
    }
    const algorithm = [
      isDark ? 'dark' : 'default',
      ...(isCompact ? ['compact'] : []),
    ];
    return {
      tokens: { ...tokens, ...overrides },
      algorithm,
    };
  };

  const applyTheme = () => {
    try {
      themeObject.setConfig(getMergedTheme());
    } catch (e) {
      console.error('Failed to apply theme overrides:', e);
    }
    setIsModalOpen(false);
  };

  return (
    <>
      <Tooltip title={t('Edit Theme')} placement="bottom">
        <Button
          buttonStyle="link"
          icon={<Icons.BgColorsOutlined iconSize="l" />}
          onClick={() => setIsModalOpen(true)}
          aria-label={t('Edit theme')}
          size="large"
        />
      </Tooltip>
      <Modal
        title={t('Theme Editor')}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={applyTheme}
        width={800}
        centered
      >
        <Collapse defaultActiveKey={['algorithms', 'Colors']}>
          <Panel header={t('Algorithms')} key="algorithms">
            <Form layout="horizontal">
              <Form.Item label={t('Dark Mode')}>
                <Switch
                  checked={isDark}
                  onChange={val => {
                    setIsDark(val);
                    updateColorBgBase(val);
                  }}
                  checkedChildren={t('Dark')}
                  unCheckedChildren={t('Light')}
                />
              </Form.Item>
              <Form.Item label={t('Compact Mode')}>
                <Checkbox
                  checked={isCompact}
                  onChange={e => setIsCompact(e.target.checked)}
                />
              </Form.Item>
            </Form>
          </Panel>

          {Object.entries(seedTokenCategories).map(([section, items]) => (
            <Panel header={t(section)} key={section}>
              <ThemeSection
                layout={section === 'Colors' ? 'horizontal' : 'default'}
              >
                {items.map(({ token, type }) => (
                  <ThemeToken
                    key={token}
                    token={token}
                    type={type}
                    tokens={tokens}
                    setToken={setToken}
                  />
                ))}
              </ThemeSection>
            </Panel>
          ))}

          <Panel header={t('Raw JSON Overrides')} key="overrides">
            <Card bodyStyle={{ padding: 0 }}>
              <JsonEditor
                showLoadingForImport
                name="json_overrides"
                value={jsonOverrides}
                onChange={setJsonOverrides}
                tabSize={2}
                width="100%"
                height="200px"
                wrapEnabled
              />
            </Card>
          </Panel>

          <Panel header={t('Resolved Theme Output')} key="resolved">
            <Card bodyStyle={{ padding: 12 }}>
              <pre style={{ whiteSpace: 'pre-wrap', fontSize: 12 }}>
                {JSON.stringify(getMergedTheme(), null, 2)}
              </pre>
            </Card>
          </Panel>
        </Collapse>
      </Modal>
    </>
  );
}

function ThemeSection({ children, layout }) {
  return layout === 'horizontal' ? (
    <Form layout="horizontal">
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        {children}
      </div>
    </Form>
  ) : (
    <Form layout="vertical">
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        {children}
      </div>
    </Form>
  );
}
function ThemeToken({ token, type, tokens, setToken }) {
  const value = tokens[token];

  const handleChange = val => {
    const normalized =
      type === 'number'
        ? typeof val === 'number' && !Number.isNaN(val)
          ? val
          : null
        : val;
    setToken(token, normalized);
  };

  const renderInput = () => {
    const commonProps = {
      id: `token-input-${token}`,
    };

    switch (type) {
      case 'color':
        return (
          <ColorPicker
            {...commonProps}
            value={value}
            onChange={(_, hex) => handleChange(hex)}
            format="hex"
          />
        );
      case 'number':
        return (
          <InputNumber
            {...commonProps}
            style={{ width: '100%' }}
            value={value}
            onChange={handleChange}
          />
        );
      case 'string':
      default:
        return (
          <Input
            {...commonProps}
            value={value}
            onChange={e => handleChange(e.target.value)}
          />
        );
    }
  };

  const width =
    type === 'string'
      ? token === 'fontFamily' || token === 'fontFamilyCode'
        ? 280
        : 240
      : 160;

  return (
    <div style={{ width }}>
      <div style={{ fontSize: 12, marginBottom: 4 }}>{token}</div>
      {renderInput()}
    </div>
  );
}
