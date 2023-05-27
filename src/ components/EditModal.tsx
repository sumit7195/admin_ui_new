import React, { useState } from "react";

import { Modal, Button, Form, Input } from "antd";

const EditModal = ({
  isModalOpen,
  handleCancel,
  preFilledValues,
  updateValue,
}) => {
  const handleValues = (values) => {
    // console.log(values);

    updateValue(values, preFilledValues.key);
  };

  return (
    <>
      <Modal
        key={preFilledValues.key}
        title="Edit"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Form onFinish={handleValues} initialValues={preFilledValues}>
          <Form.Item label="Name" name="name">
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default EditModal;
