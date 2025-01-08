package models

import (
	"time"

	"gorm.io/gorm"
)

type Priority string
type Status string

const (
	PriorityLow    Priority = "low"
	PriorityMedium Priority = "medium"
	PriorityHigh   Priority = "high"

	StatusPending   Status = "pending"
	StatusInProgress Status = "in_progress"
	StatusCompleted Status = "completed"
)

type Task struct {
	gorm.Model
	Title       string    `json:"title" binding:"required"`
	Description string    `json:"description"`
	Deadline    time.Time `json:"deadline"`
	Priority    Priority  `json:"priority"`
	Status      Status    `json:"status"`
	UserID      uint      `json:"user_id"`
	User        User      `json:"-"`
}
