import cls from './style.module.scss'
import { Delete, ContentCopy } from '@mui/icons-material'
import { ClickAwayListener, MenuItem } from '@mui/material'
export default function MenuButton ({
    setCurrentId,
    clickHandler = () => {},
    row,
    active
}) {
    function onClickAway () {
        setCurrentId(null)
    }

    return (
        <ClickAwayListener onClickAway={(e) => {
            e.preventDefault()
            onClickAway()
          }}>
            <div className={`${cls.menuButton} ${active ? cls.active : ''}`}>
                <MenuItem 
                    onClick={(e) => {
                        e.preventDefault()
                        clickHandler('deleteRow', {rowId: row.id})
                    }} 
                    className={cls.item}>
                    <Delete style={{ color: '#F76659' }} />
                    Delete
                </MenuItem>
                <MenuItem 
                    onClick={(e) => {
                        e.preventDefault()
                        clickHandler('dublicateRow', {row: row})
                    }} 
                    className={cls.item}>
                    <ContentCopy style={{ color: '#6E8BB7' }} />
                    Dublicate
                </MenuItem>
            </div>
        </ClickAwayListener>
    )
}