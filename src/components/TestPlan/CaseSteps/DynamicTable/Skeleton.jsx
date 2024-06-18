import { Skeleton, TableCell } from '@mui/material'
import { AnimatePresence, motion } from 'framer-motion'

const TableSkleton = ({ headColumns }) => {
  const borderColorClass = 'border-r border-borderColor'

  return Array(10)
    .fill()
    .map((_, index) => (
      <AnimatePresence key={index + 'skeleton'}>
        <motion.tr
          className="MuiTableRow-root MuiTableRow-head"
          initial={{ opacity: 0.4 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0.2 }}
          transition={{ duration: 0.5 }}
        >
          {headColumns?.map((item, index2) =>
            item?.columns ? (
              item?.columns.map((element) => (
                <TableCell
                  key={index + element?.title}
                  className={index2 !== headColumns?.length - 1 ? borderColorClass : ''}
                >
                  <Skeleton height={40} style={{ width: '100%' }} />
                </TableCell>
              ))
            ) : (
              <TableCell className={index2 !== headColumns?.length - 1 ? borderColorClass : ''} key={index + item?.title}>
                <Skeleton height={40} style={{ width: '100%' }} />
              </TableCell>
            )
          )}
        </motion.tr>
      </AnimatePresence>
    ))
}

export default TableSkleton
