'use client';

import React, { use, useEffect, useState } from 'react';
import {
  TransactionButton,
  useActiveAccount,
  useReadContract,
} from 'thirdweb/react';
import StaticCont from './StaticCont';
import { contract } from '../utils/contract';
import { prepareContractCall, toEther, toWei } from 'thirdweb';

const Accountability = () => {
  const account = useActiveAccount();
  const add = account?.address as string;
  const [amount, setAmount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskDescription, setTaskDescription] = useState('');

  // setting tasks
  const [tasks, setTasks] = useState([]);

  const { data: depositAmount } = useReadContract({
    contract: contract,
    method: 'getBalance',
    params: [add],
  });

  const { data: taskCount } = useReadContract({
    contract: contract,
    method: 'getTasksCount',
    params: [add],
  });

  const { data: taskComing } = useReadContract({
    contract: contract,
    method: 'getTasks',
    params: [add],
  });

  useEffect(() => {
    if (taskComing) {
      setTasks(taskComing);
    }
  }, [taskComing]);


  if (!account) {
    return <StaticCont />;
  }

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '768px',
        margin: '0 auto',
        border: '1px solid #2f3336',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Card Header */}
      <div style={{ marginBottom: '16px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Your Accountability Dashboard</h1>
        <p style={{ color: '#6b7280' }}>Account: {account.address}</p>
      </div>

      {/* Card Content */}
      <div>
        {depositAmount?.toString() === '0' && taskCount?.toString() === '0' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600' }}>Add funds now</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label htmlFor="deposit" style={{ fontSize: '14px', color: '#6b7280' }}>
                Deposit Amount
              </label>
              <input
                id="deposit"
                type="number"
                placeholder="0.001 ETH"
                style={{
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #d1d5db',
                  fontSize: '16px',
                  color: '#000',
                }}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
            </div>
            <TransactionButton
              transaction={() =>
                prepareContractCall({
                  contract: contract,
                  method: 'depositFunds',
                  value: BigInt(toWei(amount.toString())),
                })
              }
              onTransactionConfirmed={() => {
                alert('Transaction Confirmed');
                setAmount(0);
              }}
              style={{
                backgroundColor: '#6366f1',
                color: '#fff',
                padding: '10px 16px',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '600',
              }}
            >
              Deposit Funds
            </TransactionButton>
          </div>
        ) : depositAmount?.toString() !== '0' && taskCount?.toString() === '0' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600' }}>Your Current Status</h2>
            <p>Deposit Amount: {toEther(BigInt(depositAmount))?.toString()} ETH</p>
            <p>Task Count: {taskCount?.toString()}</p>
            <button
              onClick={() => setIsModalOpen(true)}
              style={{
                backgroundColor: '#6366f1',
                color: '#fff',
                padding: '10px 16px',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '600',
              }}
            >
              Add Task
            </button>
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div
            style={{
              position: 'fixed',
              top: '0',
              left: '0',
              width: '100%',
              height: '100%',
             
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                backgroundColor: '#1f1f1f', // Black background for the modal
                padding: '20px',
                borderRadius: '8px',
                maxWidth: '400px',
                width: '100%',
                color: '#fff', // Set text color to white
              }}
            >
              <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
                Add New Task
              </h2>
              <textarea
                placeholder="Enter task description"
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '4px',
                  border: '1px solid #555', // Darker border for input
                  fontSize: '16px',
                  marginBottom: '16px',
                  color: '#fff', // White text in input
                  backgroundColor: '#333', // Dark input background
                }}
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
              />
              <TransactionButton
              transaction={()=>prepareContractCall({
                contract:contract,
                method:'createTask',
                params:[taskDescription]
              })}
              onTransactionConfirmed={()=>{
                alert('Task added successfully');
                setIsModalOpen(false);
                setTaskDescription('');
              }}
              style={{
                backgroundColor: '#6366f1',
                color: '#fff',
                padding: '10px 16px',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '600',
                marginRight: '8px',
              }}
              >
                Add Task
              </TransactionButton>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  backgroundColor: '#fff',
                  color: '#6366f1',
                  padding: '10px 16px',
                  borderRadius: '4px',
                  border: '1px solid #6366f1',
                  cursor: 'pointer',
                  fontWeight: '600',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
      
      {depositAmount?.toString() !== '0' && taskCount?.toString() !== '0' && (
        <>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600' }}>Your Current Status</h2>
        <p>Deposit Amount: {toEther(BigInt(depositAmount))?.toString()} ETH</p>
        <p>Task Count: {taskCount?.toString()}</p>
        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            backgroundColor: '#6366f1',
            color: '#fff',
            padding: '10px 16px',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '600',
          }}
        >
          Add Task
        </button>
      </div>
      <div className='mt-10'>
        <h1>My Tasks</h1>
        <ul>
          {tasks.map((task, index) => (
            <li key={index}>{task?.description}</li>
          ))}
        </ul>
      </div>
      </>
      
        )}

{isModalOpen && (
          <div
            style={{
              position: 'fixed',
              top: '0',
              left: '0',
              width: '100%',
              height: '100%',
             
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                backgroundColor: '#1f1f1f', // Black background for the modal
                padding: '20px',
                borderRadius: '8px',
                maxWidth: '400px',
                width: '100%',
                color: '#fff', // Set text color to white
              }}
            >
              <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
                Add New Task
              </h2>
              <textarea
                placeholder="Enter task description"
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '4px',
                  border: '1px solid #555', // Darker border for input
                  fontSize: '16px',
                  marginBottom: '16px',
                  color: '#fff', // White text in input
                  backgroundColor: '#333', // Dark input background
                }}
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
              />
              <TransactionButton
              transaction={()=>prepareContractCall({
                contract:contract,
                method:'createTask',
                params:[taskDescription]
              })}
              onTransactionConfirmed={()=>{
                alert('Task added successfully');
                setIsModalOpen(false);
                setTaskDescription('');
              }}
              style={{
                backgroundColor: '#6366f1',
                color: '#fff',
                padding: '10px 16px',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '600',
                marginRight: '8px',
              }}
              >
                Add Task
              </TransactionButton>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  backgroundColor: '#fff',
                  color: '#6366f1',
                  padding: '10px 16px',
                  borderRadius: '4px',
                  border: '1px solid #6366f1',
                  cursor: 'pointer',
                  fontWeight: '600',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

    </div>
  )};

export default Accountability;
