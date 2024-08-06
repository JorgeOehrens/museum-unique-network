import { useCallback, useContext, useState } from "react";
import { AccountsContext } from "../accounts/AccountsContext";
import { Account } from "../accounts/types";
import { List } from "../components/List";
import { SignMessageModal } from "../modals/SignMessageModal";
import { TransferAmountModal } from "../modals/TransferAmountModal";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { useWeb3Modal } from "@web3modal/wagmi/react";

export const AccountsPage = () => {
  const { accounts, setSelectedAccountId, selectedAccountId } =
    useContext(AccountsContext);
  const accountsArray = Array.from(accounts.values());
  const [currentAccount, setCurrentAccount] = useState<Account>();
  const [transferAmountIsVisible, setTransferAmountIsVisible] = useState(false);
  const [signMessageIsVisible, setSignMessageIsVisible] = useState(false);
  const { open } = useWeb3Modal()


  const onSend = useCallback(
    (account: Account) => () => {
      setCurrentAccount(account);
      setTransferAmountIsVisible(true);
    },
    []
  );

  const onCloseTransferAmount = useCallback(() => {
    setCurrentAccount(undefined);
    setTransferAmountIsVisible(false);
  }, []);

  const onSignMessage = useCallback(
    (account: Account) => () => {
      setCurrentAccount(account);
      setSignMessageIsVisible(true);
    },
    []
  );

  const onCloseSignMessage = useCallback(() => {
    setCurrentAccount(undefined);
    setSignMessageIsVisible(false);
  }, []);

  const onCheckboxChange = useCallback(
    (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.checked) {
        setSelectedAccountId(index);
      }
    },
    [setSelectedAccountId]
  );

  return (
    <div className="page">
      <List>
        {accountsArray.map((account, index) => {
          return (
            <List.Item key={account.address}>
              <input
                type="checkbox"
                onChange={onCheckboxChange(index)}
                checked={index === selectedAccountId}
              />
              <span>{account.signerType}</span>
              <span>{account.name}</span>
              <span>{account.address}</span>
              <span>{account.balance?.toFixed(2) || "0"}</span>
              <Button onClick={onSend(account)}>Send amount</Button>
              <Button onClick={onSignMessage(account)}>Sign message</Button>
              <ButtonLink to={`/account/${account.address}`}>
                Account data
              </ButtonLink>
            </List.Item>
          );
        })}
      </List>
      <Button onClick={() => open()}>ETHEREUM Wallets</Button>
      <TransferAmountModal
        isVisible={transferAmountIsVisible}
        sender={currentAccount}
        onClose={onCloseTransferAmount}
      />
      <SignMessageModal
        isVisible={signMessageIsVisible}
        account={currentAccount}
        onClose={onCloseSignMessage}
      />
    </div>
  );
};

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  background-color: #007bff;

  &:hover {
    opacity: 0.8;
  }
`;

const ButtonLink = styled(NavLink)`
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  background-color: #007bff;
  text-decoration: none;

  &:hover {
    opacity: 0.8;
  }
`;
