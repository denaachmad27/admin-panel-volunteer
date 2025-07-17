import React from 'react';
import { User, Calendar, MapPin } from 'lucide-react';
import Badge from './Badge';
import ProgressBar from './ProgressBar';
import volunteerService from '../../services/volunteerService';

// Komponen Profile Header yang dapat digunakan kembali
const ProfileHeader = ({ 
  volunteer, 
  showProgress = true,
  size = 'lg',
  className = '' 
}) => {
  const sizes = {
    sm: { avatar: 'h-12 w-12', name: 'text-lg', subtitle: 'text-sm' },
    md: { avatar: 'h-16 w-16', name: 'text-xl', subtitle: 'text-base' },
    lg: { avatar: 'h-20 w-20', name: 'text-2xl', subtitle: 'text-lg' }
  };

  const getStatusBadge = (isActive) => {
    return (
      <Badge variant={isActive ? 'success' : 'danger'} size="sm">
        {isActive ? 'Aktif' : 'Nonaktif'}
      </Badge>
    );
  };

  const getAge = (birthDate) => {
    return volunteerService.calculateAge(birthDate);
  };

  return (
    <div className={`bg-gradient-to-r from-blue-50 to-indigo-50 p-6 ${className}`}>
      <div className="flex items-start space-x-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {volunteer.profile?.foto_profil ? (
            <img 
              className={`${sizes[size].avatar} rounded-full object-cover border-4 border-white shadow-md`}
              src={`http://127.0.0.1:8000/storage/${volunteer.profile.foto_profil}`} 
              alt={volunteer.name}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div className={`${sizes[size].avatar} rounded-full bg-slate-300 flex items-center justify-center border-4 border-white shadow-md`} style={{ display: volunteer.profile?.foto_profil ? 'none' : 'flex' }}>
            <User className="h-8 w-8 text-slate-600" />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className={`${sizes[size].name} font-bold text-slate-900 mb-1`}>
                {volunteer.profile?.nama_lengkap || volunteer.name}
              </h2>
              
              <div className="flex items-center space-x-4 text-sm text-slate-600 mb-3">
                {volunteer.profile?.tanggal_lahir && (
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{getAge(volunteer.profile.tanggal_lahir)} tahun</span>
                  </div>
                )}
                
                {volunteer.profile?.kota && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{volunteer.profile.kota}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2 mb-3">
                {getStatusBadge(volunteer.is_active)}
                <span className="text-xs text-slate-500">
                  Terdaftar {volunteerService.formatDate(volunteer.created_at)}
                </span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          {showProgress && volunteer.profile_completion && (
            <div className="mt-4">
              <ProgressBar 
                percentage={volunteer.profile_completion.percentage}
                variant="auto"
                size="md"
                showLabel={true}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;