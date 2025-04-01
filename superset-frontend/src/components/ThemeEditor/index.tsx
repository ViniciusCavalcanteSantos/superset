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
import { useState, useEffect, useMemo } from 'react';
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
import tinycolor from 'tinycolor2';
import InfoTooltip from '../InfoTooltip';

const { Title, Text } = Typography;
const { Panel } = Collapse;

const seedTokenCategories = {
  Colors: [
    {
      token: 'colorBgBase',
      type: 'color',
      help: t(
        'Used to derive the base variable of the background color gradient. In v5, we ' +
          'added a layer of background color derivation algorithm to produce map token of ' +
          'background color. But PLEASE DO NOT USE this Seed Token directly in the code!',
      ),
    },
    {
      token: 'colorPrimary',
      type: 'color',
      help: t(
        'Brand color is one of the most direct visual elements to reflect the ' +
          'characteristics and communication of the product. After you have selected ' +
          'the brand color, we will automatically generate a complete color palette ' +
          'and assign it effective design semantics.',
      ),
    },
    {
      token: 'colorSuccess',
      type: 'color',
      help: t(
        'Used to represent the token sequence of operation success, such as Result, Progress ' +
          'and other components will use these map tokens.',
      ),
    },
    {
      token: 'colorWarning',
      type: 'color',
      help: t(
        'Used to represent the warning map token, such as Notification, Alert, etc. Alert or ' +
          'Control component(like Input) will use these map tokens.',
      ),
    },
    {
      token: 'colorError',
      type: 'color',
      help: t(
        'Used to represent the visual elements of the operation failure, such as the error ' +
          'Button, error Result component, etc.',
      ),
    },
    {
      token: 'colorInfo',
      type: 'color',
      help: t(
        'Used to represent the operation information of the Token sequence, such as Alert, Tag, Progress, and other components use these map tokens.',
      ),
    },
    {
      token: 'colorLink',
      type: 'color',
      help: t('Control the color of hyperlink.'),
    },
  ],
  Typography: [
    {
      token: 'fontFamily',
      type: 'string',
      help: t(
        'The font family of Ant Design prioritizes the default interface font of the system, ' +
          'and provides a set of alternative font libraries that are suitable for screen display ' +
          'to maintain the readability and readability of the font under different platforms ' +
          'and browsers, reflecting the friendly, stable and professional characteristics.',
      ),
    },
    {
      token: 'fontFamilyCode',
      type: 'string',
      help: t('Code font, used for code, pre and kbd elements in Typography'),
    },
    {
      token: 'fontSize',
      type: 'number',
      help: t(
        'The most widely used font size in the design system, from which the text gradient ' +
          'will be derived.',
      ),
    },
    { token: 'fontWeightStrong', type: 'number' },
    { token: 'lineHeight', type: 'number' },
  ],
  Layout: [
    {
      token: 'borderRadius',
      type: 'number',
      help: t('Border radius of base components'),
    },
    {
      token: 'sizeUnit',
      type: 'number',
      help: t(
        'The unit of size change, in Ant Design, our base unit is 4, which is more ' +
          'fine-grained control of the size step',
      ),
    },
    {
      token: 'controlHeight',
      type: 'number',
      help: t(
        'The height of the basic controls such as buttons and input boxes in Ant Design',
      ),
    },
    {
      token: 'zIndexBase',
      type: 'number',
      help: t(
        'The base Z axis value of all components, which can be used to control the level ' +
          'of some floating components based on the Z axis value, such as BackTop, Affix, etc.',
      ),
    },
    {
      token: 'zIndexPopupBase',
      type: 'number',
      help: t(
        'Base zIndex of component like FloatButton, Affix which can be cover by large popup',
      ),
    },
  ],
};

export default function ThemeEditor() {
  const [tokens, setTokens] = useState({});
  const [jsonOverrides, setJsonOverrides] = useState('{}');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const [isJsonParsable, setIsJsonParsable] = useState(true);

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
  useEffect(() => {
    try {
      JSON.parse(jsonOverrides);
      setIsJsonParsable(true);
    } catch {
      setIsJsonParsable(false);
    }
  }, [jsonOverrides]);

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
    } catch {
      // fallback to empty overrides
    }

    const merged = mergeWith({}, tokens, overrides);
    merged.algorithm = [
      isDark ? 'dark' : 'default',
      ...(isCompact ? ['compact'] : []),
    ];
    return merged;
  };

  const applyTheme = () => {
    try {
      const antdTheme = getMergedTheme();
      themeObject.setConfig(antdTheme);
    } catch (e) {
      console.error('Failed to apply theme overrides:', e);
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
        onOk={applyTheme}
        width={600}
        centered
      >
        <Collapse defaultActiveKey={['algorithms', 'Colors']}>
          <Panel header={t('Algorithms')} key="algorithms">
            <Form
              layout="horizontal"
              labelAlign="right"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
            >
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
              <Form
                layout="horizontal"
                labelAlign="right"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
              >
                {items.map(({ token, type, help }) => (
                  <Form.Item
                    key={token}
                    label={
                      help ? (
                        <>
                          {token} <InfoTooltip tooltip={help} />
                        </>
                      ) : (
                        token
                      )
                    }
                    style={{ marginBottom: 16 }}
                  >
                    <ThemeToken
                      token={token}
                      type={type}
                      tokens={tokens}
                      setToken={setToken}
                    />
                  </Form.Item>
                ))}
              </Form>
            </Panel>
          ))}

          <Panel header={t('Raw JSON Overrides')} key="overrides">
            <Card bodyStyle={{ padding: 0 }}>
              {!isJsonParsable && (
                <Text type="danger" style={{ padding: 12, display: 'block' }}>
                  {t('Invalid JSON. Please correct it to preview the theme.')}
                </Text>
              )}
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
      case 'color': {
        return (
          <ColorPicker
            {...commonProps}
            value={value}
            onChange={(_, hex) => handleChange(hex)}
            format="hex"
          />
        );
      }
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

  return renderInput();
}
