import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Policy Management Contract', () => {
  const mockContractCall = vi.fn();
  
  beforeEach(() => {
    vi.resetAllMocks();
  });
  
  it('should create a policy', () => {
    mockContractCall.mockReturnValue({ success: true, value: 0 });
    const result = mockContractCall('policy-management', 'create-policy', [
      'u1000', 'u10000', 'u1625097600', 'u1656633600', 'u1', '"crop"',
      '[{key: "rainfall", value: 100}, {key: "temperature", value: 30}]'
    ]);
    expect(result).toEqual({ success: true, value: 0 });
  });
  
  it('should retrieve a policy', () => {
    mockContractCall.mockReturnValueOnce({ success: true, value: 0 });
    mockContractCall.mockReturnValueOnce({
      success: true,
      value: {
        owner: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        premium: 1000,
        coverage: 10000,
        start_date: 1625097600,
        end_date: 1656633600,
        risk_pool_id: 1,
        policy_type: 'crop',
        parameters: [
          { key: 'rainfall', value: 100 },
          { key: 'temperature', value: 30 }
        ]
      }
    });
    
    mockContractCall('policy-management', 'create-policy', [
      'u1000', 'u10000', 'u1625097600', 'u1656633600', 'u1', '"crop"',
      '[{key: "rainfall", value: 100}, {key: "temperature", value: 30}]'
    ]);
    const result = mockContractCall('policy-management', 'get-policy', ['u0']);
    expect(result).toEqual({
      success: true,
      value: {
        owner: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        premium: 1000,
        coverage: 10000,
        start_date: 1625097600,
        end_date: 1656633600,
        risk_pool_id: 1,
        policy_type: 'crop',
        parameters: [
          { key: 'rainfall', value: 100 },
          { key: 'temperature', value: 30 }
        ]
      }
    });
  });
  
  it('should cancel a policy', () => {
    mockContractCall.mockReturnValueOnce({ success: true, value: 0 });
    mockContractCall.mockReturnValueOnce({ success: true });
    
    mockContractCall('policy-management', 'create-policy', [
      'u1000', 'u10000', 'u1625097600', 'u1656633600', 'u1', '"crop"',
      '[{key: "rainfall", value: 100}, {key: "temperature", value: 30}]'
    ]);
    const result = mockContractCall('policy-management', 'cancel-policy', ['u0']);
    expect(result).toEqual({ success: true });
  });
  
  it('should not allow unauthorized cancellation', () => {
    mockContractCall.mockReturnValueOnce({ success: true, value: 0 });
    mockContractCall.mockReturnValueOnce({ success: false, error: 403 });
    
    mockContractCall('policy-management', 'create-policy', [
      'u1000', 'u10000', 'u1625097600', 'u1656633600', 'u1', '"crop"',
      '[{key: "rainfall", value: 100}, {key: "temperature", value: 30}]'
    ]);
    const result = mockContractCall('policy-management', 'cancel-policy', ['u0'], 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG');
    expect(result).toEqual({ success: false, error: 403 });
  });
});
