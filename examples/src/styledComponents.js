import styled from 'styled-components';

const ItemContent = styled.div`
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  background-color: #555878;
  border-style: solid;
  border-color: #393a52;
  border-width: 12px;
  border-top-width: 6px;
  border-bottom-width: 6px;
  color: #eee;
  user-select: none;
`;

const ActionContent = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  padding: 8px;
  font-size: 12px;
  font-weight: 500;
  box-sizing: border-box;
  color: #eee;
  user-select: none;
`;

const Avatar = styled.img`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  margin-right: 8px;
  user-drag: none;
  user-select: none;
`;

const ItemRow = styled.div`
  width: 100%;
  display: flex;
  padding: 0 8px;
`;

const ItemColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const ItemColumnCentered = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const ItemNameLine = styled.span`
  font-weight: 500;
`;

const ItemInfoLine = styled.span`
  font-size: 14px;
`;

export {
  ActionContent,
  Avatar,
  ItemColumn,
  ItemColumnCentered,
  ItemContent,
  ItemInfoLine,
  ItemNameLine,
  ItemRow,
};
