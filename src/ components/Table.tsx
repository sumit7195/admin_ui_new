import React, { useEffect, useState } from "react";

import { Table, Row, Col, Button } from "antd";

import type { ColumnType } from "antd/es/table";
import fetchData from "../utils/fetchData";

import { AiOutlineEdit, AiFillDelete } from "react-icons/ai";

import EditModal from "./EditModal";

interface DataType {
  key: React.Key;
  name: string;
  email: string;
  role: string;
}

const Tables: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(false);
  const [preFilledValue, setPreFilledValue] = useState<DataType>(
    {} as DataType
  );

  const [isModalOpen, SetIsModalOpen] = useState(false);

  const showModal = (key: string) => {
    selectedMember(key);
    SetIsModalOpen(true);
  };

  const updateData = (newValue, key) => {
    const newData = data.find((oldData) => oldData.key === key);

    const updateData = { ...newData, ...newValue };

    const updateValues = data.map((oldData) => {
      if (oldData.key === key) {
        return (oldData = updateData);
      }

      return oldData;
    });

    setData(updateValues);

    SetIsModalOpen(false);
  };

  const selectedMember = (key: string) => {
    const value = data.find((userData) => userData.key === key);

    setPreFilledValue(value);
  };

  const delteSingle = (key) => {
    const filtredData = data.filter((value) => value.key !== key);

    setData(filtredData);
  };

  const handleCancel = () => {
    SetIsModalOpen(false);
    setPreFilledValue({});
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const columns: ColumnType<DataType> = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
    },

    {
      title: "Actions",
      dataIndex: "actions",
      render: (_: any, record: DataType) => {
        return (
          <div className="flex">
            <div className="grow">
              <AiOutlineEdit
                data-testid="editBtn"
                onClick={() => showModal(record.key)}
              />
            </div>
            <div className="grow">
              <AiFillDelete
                data-testid="delteBtn"
                onClick={() => delteSingle(record.key)}
              />
            </div>
          </div>
        );
      },
    },
  ];

  const getData = async () => {
    setLoading(true);

    try {
      const data = await fetchData();
      console.log("data", data?.data);

      const newData = data.data.reduce((acc, curr) => {
        const key = curr.id;

        delete curr.id;
        const newData = { key, ...curr };

        return [...acc, newData];
      }, []);

      setData(newData);

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handleDelete = () => {
    const isInArray = (userData: DataType) => {
      if (!selectedRowKeys.includes(userData.key)) {
        return userData;
      }
      return;
    };

    const newFilteredData = data.filter(isInArray);

    setData(newFilteredData);
  };

  return loading ? (
    <div>...loading</div>
  ) : (
    <>
      <Row justify="center">
        <Col span={18}>
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={data}
          />

          {selectedRowKeys.length > 0 && (
            <Button onClick={handleDelete}>Delete Selected</Button>
          )}
        </Col>
      </Row>

      <EditModal
        isModalOpen={isModalOpen}
        handleCancel={handleCancel}
        preFilledValues={preFilledValue}
        updateValue={updateData}
      />
    </>
  );
};

export default Tables;
