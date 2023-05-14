import { Alert, Space } from 'antd';

function ErrorComponent() {
  return (
    <Space
      direction="vertical"
      style={{
        width: '100%',
      }}
    >
      <Alert message="Error Text" description="Error Description Error Error Description" type="error" closable />
    </Space>
  );
}

export { ErrorComponent };
