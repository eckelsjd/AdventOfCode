program day10

use iso_fortran_env, only: input_unit

implicit none

type :: TrailRating
    integer :: value = 0
end type

character(len=100) :: line
integer :: i, j, width, height, total_score, trail_start_marker, rating_score
integer, allocatable :: map(:, :)   ! for the topological map
integer, allocatable :: memo(:, :)  ! to keep track of where trails finish (part 1)
type(TrailRating) rating            ! to keep track of trail rating counts (part 2)

width = 0
height = 0

open(unit=input_unit, file="data/day10.txt", status="old", action="read")

! Get number of lines
do
    read(input_unit, '(A)', iostat=i) line
    width = len_trim(line)
    if (i /= 0) exit
    height = height + 1
end do
    
rewind(input_unit)

! Store text data into a topological map (numbers between 0-9)
allocate(map(height, width))
allocate(memo(height, width))

do j = 1, height
    read(input_unit, '(A)', iostat=i) line
    if (i /= 0) exit
    do i = 1, width
        read(line(i:i), '(I1)') map(j, i)
    end do
end do

total_score = 0  ! Part 1
rating_score = 0 ! Part 2
trail_start_marker = 0
memo = 0
rating%value = 0

! Count number of trails from each trailhead (i.e. 0 -> 9 ascending)
do i = 1, height
    do j = 1, width
        if (map(i, j) == trail_start_marker) then ! Found a trailhead
            memo = 0
            rating%value = 0
            call count_trails(j, i, 1, map, memo, rating)
            total_score = total_score + sum(memo)
            rating_score = rating_score + rating%value
        end if
    end do
end do

print *, "Total trail score (Part 1): ", total_score
print *, "Total rating score (Part 2): ", rating_score

contains 

! Recursively count number of trails from a given (x,y) starting point to a given target
recursive subroutine count_trails(x, y, target_num, map, memo, rating)
    integer, intent(in) :: x, y, target_num
    integer, intent(inout) :: memo(:, :)
    type(TrailRating), intent(inout) :: rating
    integer, intent(in) :: map(:, :)
    integer :: next_x, next_y

    ! Base case (found a trail end (target=9))
    if (map(y, x) == 9 .and. target_num == 10) then
        memo(y, x) = 1
        rating%value = rating%value + 1
        return
    end if

    ! Check up
    next_x = x
    next_y = y - 1
    if (next_y >= 1 .and. map(next_y, next_x) == target_num) &
        call count_trails(next_x, next_y, target_num + 1, map, memo, rating)
    
    ! Check down
    next_x = x
    next_y = y + 1
    if (next_y <= size(map, 1) .and. map(next_y, next_x) == target_num) &
        call count_trails(next_x, next_y, target_num + 1, map, memo, rating)
    
    ! Check left
    next_x = x - 1
    next_y = y
    if (next_x >= 1 .and. map(next_y, next_x) == target_num) &
        call count_trails(next_x, next_y, target_num + 1, map, memo, rating)

    ! Check right
    next_x = x + 1
    next_y = y
    if (next_x <= size(map, 2) .and. map(next_y, next_x) == target_num) &
        call count_trails(next_x, next_y, target_num + 1, map, memo, rating)

end subroutine count_trails

end program day10