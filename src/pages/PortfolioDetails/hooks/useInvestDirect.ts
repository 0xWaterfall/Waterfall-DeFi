import { useCallback } from "react";
import { useWeb3React } from "@web3-react/core";
import { useTrancheMasterContract } from "hooks/useContract";
import { useDispatch } from "react-redux";
// import { DEFAULT_GAS_LIMIT } from "config";
import { Contract } from "@ethersproject/contracts";
import { BigNumber, utils } from "ethers";
import { getMarkets } from "store/markets";
import { MarketList } from "config/market";
import { setConfirmModal } from "store/showStatus";
import { Dispatch } from "redux";
// const options = {
//   gasLimit: DEFAULT_GAS_LIMIT
// };

//TODO: upgrade UI so that user can invest more than one token at once, then upgrade this function
const invest = async (
  contract: Contract,
  amount: string,
  selectTrancheIdx: string,
  dispatch: Dispatch<any>,
  multicurrencyIdx: number,
  multicurrencyTokenCount: number
) => {
  const _amount = utils.parseEther(amount).toString();
  const _zero = utils.parseEther("0").toString();
  let tx;
  if (multicurrencyIdx === -1) {
    tx = await contract.investDirect(_amount, selectTrancheIdx, _amount);
  } else {
    const _amountArray = [];
    for (let index = 0; index < multicurrencyTokenCount; index++) {
      _amountArray.push(_zero);
    }
    _amountArray[multicurrencyIdx] = _amount;
    tx = await contract.investDirect(_amountArray, selectTrancheIdx, _amountArray);
  }

  dispatch(
    setConfirmModal({
      isOpen: true,
      txn: tx.hash,
      status: "SUBMITTED",
      pendingMessage: "Deposit Submitted"
    })
  );
  // return tx.hash;
  const receipt = await tx.wait();

  if (receipt.status) {
    dispatch(
      setConfirmModal({
        isOpen: true,
        txn: tx.hash,
        status: "COMPLETED",
        pendingMessage: "Deposit Success"
      })
    );
  } else {
    dispatch(
      setConfirmModal({
        isOpen: true,
        txn: tx.hash,
        status: "REJECTED",
        pendingMessage: "Deposit Failed"
      })
    );
  }
  // console.log(tx.hash);
  // const receipt = await tx.wait();
  // console.log(receipt.transactionHash);
  return receipt.status;
};

const useInvestDirect = (trancheMasterAddress: string, multicurrencyIdx: number, multicurrencyTokenCount: number) => {
  const dispatch = useDispatch();
  const { account } = useWeb3React();
  const contract = useTrancheMasterContract(trancheMasterAddress);
  const handleInvestDirect = useCallback(
    async (amount: string, selectTrancheIdx: string) => {
      const result = await invest(
        contract,
        amount,
        selectTrancheIdx,
        dispatch,
        multicurrencyIdx,
        multicurrencyTokenCount
      );
      dispatch(getMarkets(MarketList));
      return result;
    },
    [account, dispatch, contract]
  );

  return { onInvestDirect: handleInvestDirect };
};

export default useInvestDirect;
