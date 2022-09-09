function findLarger(nums) {
  if (nums.length <=1) return arr
  const result = [];
  let pivot = 0;
  while (result.length < nums.length) {
    const index = nums.slice(pivot + 1).findIndex(n => n > nums[pivot]);
    const num = index === -1 ? index : nums[index + pivot + 1]
    result.push(num)
    pivot++
  }
  return result
}