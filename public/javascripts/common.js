// 常用函数




    /**
     * @param pageNum 第几页
     * @param pageSize 每页大晓
     * @param array 数组
     *
     */
 function pagination (pageNum, pageSize, array)  {
            const offset = (pageNum - 1) * pageSize;
            return (offset + pageSize >= array.length) ? array.slice(offset, array.length) : array.slice(offset, offset + pageSize);

  }

 module.exports = {
      pagination
  }
