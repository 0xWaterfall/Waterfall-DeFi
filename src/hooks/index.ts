import { MasterChefAddress, TranchesAddress, WTFAddress, BUSDAddress, StrategyAddress } from "config/address";
import { ethers } from "ethers";
import { useEffect, useState, useCallback, useRef } from "react";
import { Market, PORTFOLIO_STATUS } from "types";
import { formatBalance, getPortfolioTvl, getPortfolioTotalTarget } from "utils/formatNumbers";
import getRpcUrl from "utils/getRpcUrl";
import Web3 from "web3";
import { AbiItem } from "web3-utils/types";
import { abi as MasterChefAbi } from "config/abi/MasterChef.json";
import { abi as TrancheMasterAbi } from "config/abi/TrancheMaster.json";
import { abi as ERC20Abi } from "config/abi/WTF.json";
import { abi as StrategyAbi } from "config/abi/Strategy.json";
import BigNumber from "bignumber.js";
import { BIG_ZERO, BIG_TEN } from "utils/bigNumber";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import farmsConfig from "config/farms";

export const useMarket = async (marketData: Market) => {
  if (!Web3.givenProvider) return;
  const web3 = new Web3(Web3.givenProvider);
  const contractTranches = new web3.eth.Contract(marketData.abi as AbiItem[], marketData.address);
  const contractMasterChef = new web3.eth.Contract(marketData.masterChefAbi as AbiItem[], marketData.masterChefAddress);

  if (contractTranches) {
    const _tranches = await Promise.all([
      contractTranches.methods.tranches(0).call(),
      contractTranches.methods.tranches(1).call(),
      contractTranches.methods.tranches(2).call()
    ]);

    const active = await contractTranches.methods.active().call();
    marketData.status = active ? PORTFOLIO_STATUS.ACTIVE : PORTFOLIO_STATUS.PENDING;

    const duration = await contractTranches.methods.duration().call();
    marketData.duration = duration;

    const actualStartAt = await contractTranches.methods.actualStartAt().call();
    marketData.actualStartAt = actualStartAt;

    const cycle = await contractTranches.methods.cycle().call();
    marketData.cycle = cycle;

    marketData.tranches = _tranches;
    marketData.totalTranchesTarget = getPortfolioTotalTarget(_tranches);
    marketData.tvl = getPortfolioTvl(_tranches);
  }
  if (contractMasterChef) {
    const _poolInfos = await Promise.all([
      contractMasterChef.methods.poolInfo(0).call(),
      contractMasterChef.methods.poolInfo(1).call(),
      contractMasterChef.methods.poolInfo(2).call()
    ]);
    marketData.pools = _poolInfos;
    // marketData.totalAllocPoints = getTotalAllocPoints(_poolInfos) + "";
  }

  return marketData;
};
export const useStrategyFarm = () => {
  const [result, setResult] = useState<any>([]);

  const getFarmResult = (shares: BigNumber, addr: string) => {
    console.log(shares);
    return {
      shares: new BigNumber(shares.toString()).dividedBy(BIG_TEN.pow(16)).toNumber(),
      farmName: farmsConfig[addr]
    };
  };
  useEffect(() => {
    const fetchFarms = async () => {
      const contractStrategy = getContract(StrategyAbi, StrategyAddress);
      console.log(contractStrategy, "contractStrategy");
      const _result = [];
      try {
        const farm0 = await contractStrategy.farms(0);
        if (farm0) _result.push(getFarmResult(farm0.shares, farm0.addr));
        const farm1 = await contractStrategy.farms(1);
        if (farm1) _result.push(getFarmResult(farm1.shares, farm1.addr));
        const farm2 = await contractStrategy.farms(2);
        if (farm2) _result.push(getFarmResult(farm2.shares, farm2.addr));
        setResult(_result);
      } catch (e) {
        console.log(e);
      }
    };

    fetchFarms();
  }, []);

  return result;
};
export const useTrancheBalance = () => {
  const [balance, setBalance] = useState(BIG_ZERO);
  const [invested, setInvested] = useState(BIG_ZERO);
  const { account } = useWeb3React<Web3Provider>();

  useEffect(() => {
    const fetchBalance = async () => {
      const contractMasterChef = getContract(TrancheMasterAbi, TranchesAddress);
      const result = await contractMasterChef.balanceOf(account);
      setBalance(result.balance ? new BigNumber(result.balance?._hex) : BIG_ZERO);
      setInvested(result.invested);
    };

    fetchBalance();
  }, [account]);

  return { balance, invested };
};
export const usePendingWTFReward = (poolId?: number) => {
  const [pendingReward, setPendingReward] = useState(BIG_ZERO);
  const { account } = useWeb3React<Web3Provider>();
  const allPool = poolId == undefined ? true : false;
  useEffect(() => {
    const fetchPendingReward = async () => {
      try {
        if (!account) return;
        const contractMasterChef = getContract(MasterChefAbi, MasterChefAddress);
        let _pendingReward = new BigNumber(0);

        if (poolId == 0 || allPool) {
          const pendingReward0 = await contractMasterChef.pendingReward(account, 0);
          if (!pendingReward0.isZero()) _pendingReward = _pendingReward.plus(new BigNumber(pendingReward0.toString()));
        }
        if (poolId == 1 || allPool) {
          const pendingReward1 = await contractMasterChef.pendingReward(account, 1);
          if (!pendingReward1.isZero()) _pendingReward = _pendingReward.plus(new BigNumber(pendingReward1.toString()));
        }
        if (poolId == 2 || allPool) {
          const pendingReward2 = await contractMasterChef.pendingReward(account, 2);
          if (!pendingReward2.isZero()) _pendingReward = _pendingReward.plus(new BigNumber(pendingReward2.toString()));
        }

        console.log("pendingReward_", _pendingReward);
        if (!_pendingReward.isZero()) setPendingReward(_pendingReward);
      } catch (e) {
        console.log(e);
      }
    };

    fetchPendingReward();
  }, [account]);

  return pendingReward;
};
export const useBalance = (address: string) => {
  const [balance, setBalance] = useState("0");
  const { account, ...p } = useWeb3React<Web3Provider>();

  useEffect(() => {
    const fetchBalance = async () => {
      const contract = getContract(ERC20Abi, address);
      const tokenBalance = await contract.balanceOf(account);
      const value = formatBalance(tokenBalance.toString());
      setBalance(value);
    };

    fetchBalance();
  }, [address, account]);

  return balance;
};
export const useWTF = () => {
  const [weekDistribution, setWeekDistribution] = useState(BIG_ZERO);

  useEffect(() => {
    const fetchBalance = async () => {
      const contractMasterChef = getContract(MasterChefAbi, MasterChefAddress);
      const rewardPerBlock = await contractMasterChef.rewardPerBlock();
      const _weekDistribution = new BigNumber(rewardPerBlock.toString()).dividedBy(BIG_TEN.pow(18)).times(28800 * 7);
      setWeekDistribution(_weekDistribution);
    };

    fetchBalance();
  }, [MasterChefAddress]);

  return { weekDistribution };
};
export const getContract = (abi: any, address: string, signer?: ethers.Signer | ethers.providers.Provider) => {
  const simpleRpcProvider = new ethers.providers.JsonRpcProvider(getRpcUrl());
  const signerOrProvider = signer ?? simpleRpcProvider;
  return new ethers.Contract(address, abi, signerOrProvider);
};

export const getSigner = () => {
  if (window.ethereum) {
    const chainId = window.ethereum.chainId;
    if (chainId !== "0x61" && chainId !== "0x38") return;

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    return signer;
  }
  return;
};
