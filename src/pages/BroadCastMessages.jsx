import { useEffect, useState } from "react";
import axios from "axios";
import "antd/dist/reset.css";
import {
  Card,
  Table,
  Input,
  Button,
  Typography,
  Space,
  message as antMessage,
  Checkbox,
} from "antd";

const { TextArea } = Input;
const { Title, Text } = Typography;

const BroadcastMessages = () => {
  const [members, setMembers] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [messageText, setMessageText] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  /* ---------------- FETCH MEMBERS ---------------- */
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/churchapp/tasks/getAllMembers`,
          { withCredentials: true }
        );

        // Add a disabled flag if no phone
        const updatedMembers = data.map((m) => ({
          ...m,
          disabled: !m.contact && !m.otherContact,
        }));
        setMembers(updatedMembers);
      } catch {
        antMessage.error("Failed to load members");
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  /* ---------------- TABLE CONFIG ---------------- */
  const columns = [
    {
      title: "Name",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Phone Number",
      dataIndex: "contact",
      key: "phoneNumber",
      render: (_, record) =>
        record.contact || record.otherContact ? (
          record.contact || record.otherContact
        ) : (
          <Text type='secondary'>No phone</Text>
        ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => {
      setSelectedRowKeys(newSelectedRowKeys);
      setSelectAll(
        newSelectedRowKeys.length === members.filter((m) => !m.disabled).length
      );
    },
    getCheckboxProps: (record) => ({
      disabled: record.disabled,
    }),
  };

  const handleSelectAll = (e) => {
    const selectableKeys = members.filter((m) => !m.disabled).map((m) => m._id);
    if (e.target.checked) {
      setSelectedRowKeys(selectableKeys);
      setSelectAll(true);
    } else {
      setSelectedRowKeys([]);
      setSelectAll(false);
    }
  };

  /* ---------------- SEND BROADCAST ---------------- */
  const sendBroadcast = async () => {
    if (!messageText.trim()) {
      antMessage.warning("Message cannot be empty");
      return;
    }

    if (selectedRowKeys.length === 0) {
      antMessage.warning("Please select at least one recipient");
      return;
    }

    try {
      setSending(true);

      const payload = {
        message: messageText,
        recipients: selectedRowKeys,
        selectAll: selectAll,
      };

      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/churchapp/messages/broadcast`,
        payload,
        { withCredentials: true }
      );

      console.log(data);

      antMessage.success(
        `Message sent to ${data.sent} member(s). Failed: ${data.failed}`
      );

      if (data.failedRecipients?.length > 0) {
        antMessage.warning(
          `Failed to send to: ${data.failedRecipients
            .map((f) => f.name)
            .join(", ")}`
        );
      }

      setMessageText("");
      setSelectedRowKeys([]);
      setSelectAll(false);
    } catch (error) {
      antMessage.error(error.response?.data?.message || "Broadcast failed");
    } finally {
      setSending(false);
    }
  };

  return (
    <Card style={{ maxWidth: 1100, margin: "0 auto" }}>
      <Title level={3}>📢 Broadcast SMS</Title>

      {/* ------------ SELECT ALL TOGGLE ------------ */}
      <Space style={{ marginBottom: 10 }}>
        <Checkbox checked={selectAll} onChange={handleSelectAll}>
          Select All
        </Checkbox>
        <Text>{selectedRowKeys.length} member(s) selected</Text>
      </Space>

      {/* ------------ MEMBERS TABLE ------------ */}
      <Table
        rowKey='_id'
        columns={columns}
        dataSource={members}
        rowSelection={rowSelection}
        loading={loading}
        pagination={{ pageSize: 8 }}
      />

      {/* ------------ MESSAGE COMPOSER ------------ */}
      <Card type='inner' title='Message' style={{ marginTop: 20 }}>
        <TextArea
          rows={4}
          placeholder='Type your broadcast message here...'
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          maxLength={300}
          showCount
        />
      </Card>

      {/* ------------ ACTION BUTTON ------------ */}
      <Space style={{ marginTop: 20 }}>
        <Button
          type='primary'
          size='large'
          loading={sending}
          onClick={sendBroadcast}
        >
          Send Broadcast
        </Button>
      </Space>
    </Card>
  );
};

export default BroadcastMessages;
