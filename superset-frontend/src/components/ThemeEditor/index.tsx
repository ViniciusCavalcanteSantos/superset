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
import { useState } from 'react';
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

// Manually curated list of seed tokens (excluding animation-related ones)
const seedTokenCategories: Record<
  string,
  { token: string; type: 'color' | 'number' | 'string' }[]
> = {
  Colors: [
    { token: 'colorPrimary', type: 'color' },
    { token: 'colorSuccess', type: 'color' },
    { token: 'colorWarning', type: 'color' },
    { token: 'colorError', type: 'color' },
    { token: 'colorInfo', type: 'color' },
    { token: 'colorBgBase', type: 'color' },
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
  const initialTheme = themeObject.toSerializedConfig();
  const filteredKeys = Object.values(seedTokenCategories)
    .flat()
    .map(entry => entry.token);
  const initialTokens = filteredKeys.reduce(
    (acc, key) => {
      acc[key] = themeObject.theme[key];
      return acc;
    },
    {} as Record<string, any>,
  );

  const { algorithm } = initialTheme;
  const [tokens, setTokens] = useState<Record<string, any>>(initialTokens);
  const [jsonOverrides, setJsonOverrides] = useState<string>('{}');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDark, setIsDark] = useState(algorithm?.includes('dark'));
  const [isCompact, setIsCompact] = useState(algorithm?.includes('compact'));

  const getMergedTheme = () => {
    try {
      const overrides = JSON.parse(jsonOverrides);
      const merged = mergeWith({}, tokens, overrides);
      merged.algorithm = [
        isDark ? 'dark' : 'default',
        ...(isCompact ? ['compact'] : []),
      ];
      return merged;
    } catch (e) {
      return tokens;
    }
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
        onOk={() => setIsModalOpen(false)}
        width={800}
        centered
      >
        <Collapse defaultActiveKey={['algorithms', 'Colors']}>
          <Panel header={t('Algorithms')} key="algorithms">
            <Form layout="horizontal">
              <Form.Item label={t('Dark Mode')}>
                <Switch
                  checked={isDark}
                  onChange={setIsDark}
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
                    setTokens={setTokens}
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
function ThemeSection({
  children,
  layout,
}: {
  children: React.ReactNode;
  layout?: 'horizontal' | 'default';
}) {
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

function ThemeToken({
  token,
  type,
  tokens,
  setTokens,
}: {
  token: string;
  type: 'color' | 'number' | 'string';
  tokens: Record<string, any>;
  setTokens: React.Dispatch<React.SetStateAction<Record<string, any>>>;
}) {
  const initialValue = tokens[token];
  const [value, setValue] = useState(initialValue);

  const handleChange = (val: any) => {
    const normalized =
      type === 'number'
        ? typeof val === 'number' && !Number.isNaN(val)
          ? val
          : null
        : val;
    setValue(normalized);
    setTokens(prev => ({ ...prev, [token]: normalized }));
  };

  const renderInput = () => {
    switch (type) {
      case 'color':
        return (
          <ColorPicker
            value={value}
            onChange={(_, hex) => handleChange(hex)}
            format="hex"
          />
        );
      case 'number':
        return (
          <InputNumber
            style={{ width: '100%' }}
            value={value}
            onChange={handleChange}
          />
        );
      case 'string':
      default:
        return (
          <Input value={value} onChange={e => handleChange(e.target.value)} />
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
    <div style={{ width, marginBottom: 0 }}>
      <label style={{ display: 'block', fontSize: 12, marginBottom: 4 }}>
        {token}
      </label>
      {renderInput()}
    </div>
  );
}
